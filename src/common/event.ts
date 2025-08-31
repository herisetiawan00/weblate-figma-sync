import { EventHandler } from "@create-figma-plugin/utilities";
import { Route } from "./constants/routes";
import { ICollection, IWeblateConfiguration } from "./types";

export interface IClose extends EventHandler {
  name: 'CLOSE';
  handler: () => void;
}

export interface INavigationReplace extends EventHandler {
  name: 'N_REPLACE';
  handler: (args: { name: Route, args?: any }) => void;
}

export interface INavigationPush extends EventHandler {
  name: 'N_PUSH';
  handler: (args: { name: Route, args?: any }) => void;
}

export interface INavigationPop extends EventHandler {
  name: 'N_POP';
}

export interface INavigationPopUntil extends EventHandler {
  name: 'N_POP_UNTIL';
  handler: (routeName: Route) => void;
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
