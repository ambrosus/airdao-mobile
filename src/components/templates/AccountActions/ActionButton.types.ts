import { ExplorerAccount } from '@models';

export interface ActionButtonProps {
  account: ExplorerAccount; // TODO change to AccountDBModel
}

export enum AccountActionsKey {
  SEND = 'send',
  SWAP = 'swap',
  STAKE = 'stake',
  BRIDGE = 'bridge',
  KOSMOS = 'kosmos'
}
