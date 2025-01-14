import '@walletconnect/react-native-compat';
import { WalletKitTypes } from '@reown/walletkit';

export type Proposal = WalletKitTypes.EventArguments['session_proposal'];
export type SessionProposalEvent =
  WalletKitTypes.EventArguments['session_proposal'];
export type SessionRequestEvent =
  WalletKitTypes.EventArguments['session_request'];
export type SessionAuthenticateEvent =
  WalletKitTypes.EventArguments['session_authenticate'];
export type SessionDeleteEvent =
  WalletKitTypes.EventArguments['session_delete'];

export enum WALLET_CORE_EVENTS {
  'SESSION_PROPOSAL' = 'session_proposal',
  'SESSION_REQUEST' = 'session_request',
  'SESSION_DELETE' = 'session_delete',
  'PROPOSAL_EXPIRE' = 'proposal_expire',
  'SESSION_REQUEST_EXPIRE' = 'session_request_expire',
  'SESSION_AUTH' = 'session_authenticate'
}

export enum WALLET_CLIENT_EVENTS {
  'SESSION_PING' = 'session_ping'
}
