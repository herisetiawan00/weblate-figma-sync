import { emit, on, once, showUI } from "@create-figma-plugin/utilities";
import { IClose, ICollectionFetch, ICollectionResult, IConfigurationFetch, IConfigurationResult, IReset, IWeblateSyncFinish, IWeblateSyncStart, IWeblateSyncUpdate } from "./event";
import { IWeblateComponentsResponse, IWeblateTranslationResponse } from "../domain/weblate/weblate.types";
import { camelToTitle } from "../utils/string.utils";

const setupHandlers = () => {
  once<IClose>('CLOSE', figma.closePlugin)
  on<IWeblateSyncStart>('W_SYNC_START', async (config) => {
    try {
      if (config.remember) {
        await figma.clientStorage.setAsync('config', JSON.stringify(config));
      }

      emit<IWeblateSyncUpdate>('W_SYNC_UPDATE', 'get components from url...');

      const headers = { Authorization: `Token ${config.token}` }
      const components = await fetch(`${config.baseUrl}/api/components/`, {
        headers
      });

      const componentsJson: IWeblateComponentsResponse = await components.json();

      emit<IWeblateSyncUpdate>('W_SYNC_UPDATE', `found ${componentsJson.results.length} components, get translations...`);

      const translationUrls = componentsJson.results.map((c) => c.translations_url);

      const translations = await Promise.all(translationUrls.map((url) => fetch(url.replace('127.0.0.1', 'localhost'), { headers })));

      const translationsJsons: IWeblateTranslationResponse[] = await Promise.all(translations.map((t) => t.json()));

      let result: { [x: string]: { [x: string]: string } } = {}

      const countFiles = translationsJsons.reduce((acc, translation) => acc + translation.results.length, 0);
      emit<IWeblateSyncUpdate>('W_SYNC_UPDATE', `found ${countFiles} translation files, downloading...`);

      await Promise.all(
        translationsJsons.map(
          (t) => Promise.all(
            t.results.map(
              (x) => fetch(
                x.file_url, { headers })
                .then((r) => r.json())
                .then((j) => {
                  const language = config.languageAsMode ? x.language_code : x.language.name;
                  return result[language] = { ...result[language] ?? {}, ...j };
                })
            )
          )
        )
      )

      const countKeys = Object.entries(result).reduce((acc, [,translation]) => acc + Object.values(Object.values(translation)).length, 0);

      emit<IWeblateSyncUpdate>('W_SYNC_UPDATE', `found ${countKeys} translation keys, importing...`);

      const collection = figma.variables.getVariableCollectionById(config.collection);

      if (collection) {
        const modes = collection.modes;
        Object.entries(result).forEach(
          ([lang, translation]) => {
            if (config.languageAsMode) {
              const modeId = modes.find((m) => m.name == lang)?.modeId ?? collection.addMode(lang);

              const localVariables = figma.variables.getLocalVariables('STRING');
              const collectionVariables = localVariables.filter(v => v.variableCollectionId === config.collection);
              const variableMap = new Map(collectionVariables.map(v => [v.name, v]));

              Object.entries(translation).forEach(
                ([key, value]) => {
                  const name = key.split('.').map(camelToTitle).join('/');
                  const existingVariable = variableMap.get(name);
                  if (existingVariable) {
                    existingVariable.setValueForMode(modeId, value);
                  } else {
                    const newVariable = figma.variables.createVariable(name, config.collection, 'STRING');
                    newVariable.setValueForMode(modeId, value);
                  }
                }
              );
            } else {
              const modeId = collection.modes[0].modeId;

              const sanitizedLanguage = lang.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim()
              const localVariables = figma.variables.getLocalVariables('STRING');
              const collectionVariables = localVariables.filter(v => v.variableCollectionId === config.collection);
              const variableMap = new Map(collectionVariables.map(v => [v.name, v]));

              Object.entries(translation).forEach(
                ([key, value]) => {
                  const name = [sanitizedLanguage, ...key.split('.').map(camelToTitle)].join('/');
                  const existingVariable = variableMap.get(name);
                  if (existingVariable) {
                    existingVariable.setValueForMode(modeId, value);
                  } else {
                    const newVariable = figma.variables.createVariable(name, config.collection, 'STRING');
                    newVariable.setValueForMode(modeId, value);
                  }
                }
              );
            }
          }
        );
      }

      emit<IWeblateSyncUpdate>('W_SYNC_UPDATE', `Import finished`);

      emit<IWeblateSyncFinish>('W_SYNC_FINISH', { success: true });
    } catch (e) {
      emit<IWeblateSyncFinish>('W_SYNC_FINISH', { success: false, error: `${e}` });
    }
  });
  on<ICollectionFetch>('C_COLLECTION_FETCH', async () => {
    const collection = figma.variables.getLocalVariableCollections();
    emit<ICollectionResult>('C_COLLECTION_RESULT', collection.map(({ id, name }) => ({ id, name })));
  });
  on<IConfigurationFetch>('C_CONFIGURATION_FETCH', async () => {
    const config = await figma.clientStorage.getAsync('config');
    if (config) {
      emit<IConfigurationResult>('C_CONFIGURATION_RESULT', JSON.parse(config));
    }
  });
  on<IReset>('RESET', () => {
    showUI({ height: 340, width: 240 })
  });
}

export default setupHandlers;
