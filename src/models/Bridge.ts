import { Network as BridgeNetwork, Token } from '@lib/bridgeSDK/models/types';
import { ethers } from 'ethers';

export interface Bridge {
  bridges: Bridges;
  tokens: Tokens;
  ambFaucetAddress: string;
}

export interface Bridges {
  eth: BridgeItem;
  bsc: BridgeItem;
}

export interface BridgeItem {
  amb: string;
  side: string;
}

export interface BridgePairsModel {
  name: PairsNetworksNamesModel;
  pairs: [Token, Token][];
  provider: Promise<ethers.providers.JsonRpcProvider | undefined>;
}

export interface RenderTokenItem {
  renderTokenItem: Token;
  name: PairsNetworksNamesModel;
  pairs: [Token, Token];
  provider?: Promise<ethers.providers.JsonRpcProvider | undefined>;
}

export type PairsNetworksNamesModel =
  | 'eth->amb'
  | 'amb->eth'
  | 'bsc->amb'
  | 'amb->bsc'
  | string;

export interface Tokens {
  SAMB: TokenConfig;
  SAMB2: TokenConfig;
  WETH: TokenConfig;
  WBNB: TokenConfig;
  USDC: TokenConfig;
  BUSD: TokenConfig;
  USDT: TokenConfig;
}

export interface TokenConfig {
  isActive: boolean;
  name: string;
  symbol: string;
  logo: string;
  networks: Networks;
  isPrimary?: boolean;
  nativeCoin?: string;
}

export interface Networks {
  amb: TokenNetworks;
  bsc: TokenNetworks;
  eth: TokenNetworks;
}

export interface TokenNetworks {
  address: string;
  denomination: number;
  isPrimary: boolean;
  nativeCoin?: string;
}

export interface ParsedBridge {
  amb: string;
  id: BridgeNetwork | string;
  name: string;
  side: string;
}
export interface BridgeNetworkPickerProps {
  destination: 'from' | 'to';
}

export type NetworksNames = 'amb' | 'eth' | 'bsc';
