import { EventHandler } from "@create-figma-plugin/utilities";
import { ICollection, IWeblateConfiguration } from "./types";

export interface IClose extends EventHandler {
  name: 'CLOSE';
  handler: () => void;
}

export interface IReset extends EventHandler {
  name: 'RESET';
  handler: () => void;
}

export interface IWeblateSyncStart extends EventHandler {
  name: 'W_SYNC_START';
  handler: (config: IWeblateConfiguration) => void;
}

export interface IWeblateSyncUpdate extends EventHandler {
  name: 'W_SYNC_UPDATE';
  handler: (info: string) => void;
}

export interface IWeblateSyncFinish extends EventHandler {
  name: 'W_SYNC_FINISH';
  handler: (result: { success: boolean, error?: string }) => void;
}

export interface ICollectionFetch extends EventHandler {
  name: 'C_COLLECTION_FETCH';
  handler: () => void;
}

export interface ICollectionResult extends EventHandler {
  name: 'C_COLLECTION_RESULT';
  handler: (collections: ICollection[]) => void;
}

export interface IConfigurationFetch extends EventHandler {
  name: 'C_CONFIGURATION_FETCH';
  handler: () => void;
}

export interface IConfigurationResult extends EventHandler {
  name: 'C_CONFIGURATION_RESULT';
  handler: (config: IWeblateConfiguration) => void;
}
