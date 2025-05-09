import { BigNumber, BigNumberish, ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import {
  FeeData,
  Network as BridgeNetwork,
  Token
} from '@lib/bridgeSDK/models/types';

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

export interface CryptoAmount {
  amount: BigNumber | BigNumberish;
  decimals: number;
}

export interface DataToPreviewModel {
  name: string;
  crypto: CryptoAmount;
  symbol: CryptoCurrencyCode | string;
}

export interface PreviewDataWithFeeModel {
  value: {
    feeData: FeeData;
    gasFee: BigNumberish;
  };
  dataToPreview: DataToPreviewModel[];
}

export interface TransactionOnLoopModel {
  address: string;
  timestamp: number;
  feeData: FeeData;
}

export type BridgeSelectorTypes = 'from' | 'destination';
export interface BridgeNetworkPickerProps {
  type: BridgeSelectorTypes;
}

export interface BridgeFeeModel {
  amount: BigNumber;
  networkFee: BigNumber;
  feeToken: Token;
  bridgeAmount: BigNumber;
  feeData: FeeData;
}

export type NetworksNames = 'amb' | 'eth' | 'bsc' | string;
