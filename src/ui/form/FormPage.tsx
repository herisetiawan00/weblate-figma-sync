import {
  Button,
  Columns,
  Container,
  Muted,
  Text,
  Textbox,
  VerticalSpace,
  Dropdown,
  Checkbox,
} from '@create-figma-plugin/ui'
import { h } from 'preact';
import { useCallback, useEffect, useState } from "preact/hooks";
import { emit, once } from '@create-figma-plugin/utilities';
import { ICollection } from '../../common/types';
import { ICollectionFetch, ICollectionResult, IConfigurationFetch, IConfigurationResult, IWeblateSyncStart } from '../../common/event';

const FormPage = ({ onSubmit }: { onSubmit: () => void }) => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [collection, setCollection] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [languageAsMode, setLanguageAsMode] = useState<boolean>(false);

  const [collections, setCollections] = useState<ICollection[]>([]);

  useEffect(() => {
    once<ICollectionResult>('C_COLLECTION_RESULT', setCollections);
  }, [collections]);

  useEffect(() => {
    once<IConfigurationResult>('C_CONFIGURATION_RESULT', (config) => {
      setBaseUrl(config.baseUrl);
      setCollection(config.collection);
      setToken(config.token);
      setRemember(config.remember);
      setLanguageAsMode(config.languageAsMode);
    });
  }, []);

  useEffect(() => {
    emit<IConfigurationFetch>('C_CONFIGURATION_FETCH');
    emit<ICollectionFetch>('C_COLLECTION_FETCH');
  }, []);

  const handleSyncButton = useCallback(() => {
    onSubmit();
    emit<IWeblateSyncStart>(
      'W_SYNC_START',
      { baseUrl, collection, token, remember, languageAsMode }
    )
  }, [baseUrl, collection, token, remember]);

  return (
    <Container space="medium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%' }}>
      <VerticalSpace space="large" />
      <Text>
        <Muted>Weblate URL</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setBaseUrl}
        value={baseUrl}
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Collection</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Dropdown
        options={[{ value: '', text: '-- select --', disabled: true }, ...collections.map((item) => ({ value: item.id, text: `${item.name}` }))]}
        value={collection}
        onValueChange={setCollection}
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>API Token</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setToken}
        value={token}
      />
      <VerticalSpace space="large" />
      <Checkbox
        onClick={() => setRemember(!remember)}
        value={remember}>
        <Text>Remember configuration</Text>
      </Checkbox>
      <VerticalSpace space="large" />
      <Checkbox
        onClick={() => setLanguageAsMode(!languageAsMode)}
        value={languageAsMode}>
        <Text>Use language as variable mode</Text>
      </Checkbox>
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleSyncButton} disabled={!baseUrl || !collection || !token}>
          Sync
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default FormPage;
