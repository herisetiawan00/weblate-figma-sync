import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  Textbox,
  VerticalSpace,
  LoadingIndicator,
  Dropdown,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { CloseHandler, GetCollectionHandler, ICollection, SetCollectionHandler, SyncFinishHandler, SyncInfoHandler, SyncWeblateHandler } from './types'

function Plugin() {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [collectionId, setCollectionId] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [syncInfo, setSyncInfo] = useState<string>('');

  const [result, setResult] = useState<boolean | null>(null);

  const [collection, setCollection] = useState<ICollection[]>([]);

  const handleCloseButtonClick = useCallback(() => emit<CloseHandler>('CLOSE'), []);

  useEffect(() => {
    console.log(collectionId)
  }, [collectionId])

  const handleSyncButtonClick = useCallback(() => {
    setIsLoading(true);
    setResult(null);
    emit<SyncWeblateHandler>(
      'SYNC',
      {
        baseUrl, collection: collectionId, token,
      }
    )
  }, [baseUrl, collectionId, token]);

  useEffect(() => {
    on<SyncFinishHandler>('SYNC_FINISH', (result) => {
      setResult(result);
      setIsLoading(false);
      setSyncInfo('');
    });
    on<SyncInfoHandler>('SYNC_INFO', setSyncInfo);
    on<SetCollectionHandler>('SET_COLLECTION', setCollection);

    emit<GetCollectionHandler>('GET_COLLECTION');
  }, []);

  if (result != null) {
    return (
      <Container space="medium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        {
          result
            ? <Text style={{ color: '#78C841' }}>Sync Success</Text>
            : <Text style={{ color: '#E62727' }}>Sync Failed</Text>
        }
        <VerticalSpace space="extraLarge" />
        <Columns space="extraSmall">
          {!result &&
            <Button fullWidth onClick={() => {
              setResult(null);
            }}>
              Back
            </Button>
          }
          <Button fullWidth onClick={handleCloseButtonClick} secondary>
            Close
          </Button>
        </Columns>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }} space='medium' >
        <Container style={{ height: 50 }} space='small' >
          <LoadingIndicator />
        </Container>
        <Text>{syncInfo}</Text>
      </Container>
    )
  }

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
        options={[{ value: '', text: '-- select --', disabled: true }, ...collection.map((item) => ({ value: item.id, text: `${item.name}` }))]}
        value={collectionId}
        onValueChange={setCollectionId}
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
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleSyncButtonClick}>
          Sync
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
