import { emit, on, once } from "@create-figma-plugin/utilities";
import { CloseHandler, GetCollectionHandler, IWeblateComponentsResponse, IWeblateTranslationResponse, SetCollectionHandler, SyncFinishHandler, SyncInfoHandler, SyncWeblateHandler } from "./types";
import { camelToTitle } from "./helper";

const setupHandlers = () => {
  once<CloseHandler>('CLOSE', figma.closePlugin)
  on<SyncWeblateHandler>('SYNC', async (config) => {
    try {
      emit<SyncInfoHandler>('SYNC_INFO', 'get components from url...');

      const headers = { Authorization: `Token ${config.token}` }
      const components = await fetch(`${config.baseUrl}/api/components/`, {
        headers
      });

      const componentsJson: IWeblateComponentsResponse = await components.json();

      emit<SyncInfoHandler>('SYNC_INFO', `found ${componentsJson.results.length} components, get translations...`);

      const translationUrls = componentsJson.results.map((c) => c.translations_url);

      const translations = await Promise.all(translationUrls.map((url) => fetch(url.replace('127.0.0.1', 'localhost'), { headers })));

      const translationsJsons: IWeblateTranslationResponse[] = await Promise.all(translations.map((t) => t.json()));

      let result: { [x: string]: { [x: string]: string } } = {}

      const countFiles = translationsJsons.reduce((acc, translation) => acc + translation.results.length, 0);
      emit<SyncInfoHandler>('SYNC_INFO', `found ${countFiles} translation files, downloading...`);

      await Promise.all(
        translationsJsons.map(
          (t) => Promise.all(
            t.results.map(
              (x) => fetch(
                // x.file_url.replace('127.0.0.1', 'localhost'), { headers })
                x.file_url, { headers })
                .then((r) => r.json())
                .then((j) => result[x.language_code] = { ...result[x.language_code] ?? {}, ...j })
            )
          )
        )
      )

      const countKeys = Object.entries(result).reduce((acc, translation) => acc + Object.values(translation).length, 0);

      emit<SyncInfoHandler>('SYNC_INFO', `found ${countKeys} translation keys, importing...`);

      const collection = figma.variables.getVariableCollectionById(config.collection);

      if (collection) {
        const modes = collection.modes;
        // Object.entries({ 'en': result['en'] }).forEach(
        Object.entries(result).forEach(
          ([lang, translation]) => {
            // const modeId = collection.modes[0].modeId;
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
          }
        );
      }

      emit<SyncFinishHandler>('SYNC_FINISH', true);
    } catch (e) {
      emit<SyncFinishHandler>('SYNC_FINISH', false);
    }
  });
  on<GetCollectionHandler>('GET_COLLECTION', async () => {
    const collection = figma.variables.getLocalVariableCollections();
    emit<SetCollectionHandler>('SET_COLLECTION', collection.map(({ id, name }) => ({ id, name })));
  });
}

export default setupHandlers;
