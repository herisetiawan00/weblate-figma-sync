import { EventHandler } from '@create-figma-plugin/utilities'

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}

export interface SyncWeblateHandler extends EventHandler {
  name: 'SYNC'
  handler: (config: IWeblateConfiguration) => void
}

export interface SyncInfoHandler extends EventHandler {
  name: 'SYNC_INFO'
  handler: (info: string) => void;
}

export interface SyncFinishHandler extends EventHandler {
  name: 'SYNC_FINISH'
  handler: (success: boolean) => void
}

export interface GetCollectionHandler extends EventHandler {
  name: 'GET_COLLECTION'
  handler: () => void
}

export interface SetCollectionHandler extends EventHandler {
  name: 'SET_COLLECTION',
  handler: (collection: ICollection[]) => void
}

export interface ICollection {
  id: string
  name: string
}

export interface IWeblateConfiguration {
  baseUrl: string
  collection: string
  token: string
}

export interface IWeblateComponentsResponse {
  results: {
    translations_url: string
    name: string
  }[]
}

export interface IWeblateTranslationResponse {
  results: {
    language_code: string
    file_url: string
  }[]
}

