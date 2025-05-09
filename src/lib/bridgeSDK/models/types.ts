import { BigNumber, BigNumberish, ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { AccountDBModel } from '@database';
import { NetworksNames } from '@models/Bridge';

export type BridgeDataState = {
  from: string;
  destination: string;
  bridgeConfig: unknown;
  ownerAddress?: string;
  pairs: Token[][];
};

export type BridgeNetwork = 'eth' | 'bsc';
export type Network = BridgeNetwork | 'amb';
export type RelayUrls = { [net in BridgeNetwork]: string };
export type BridgeAddresses = { [from: string]: { [to: string]: string } };

export interface EnvData {
  relayUrls: RelayUrls;
}

export interface Token {
  balance: BigNumberish;
  address: string;
  bridgeNetwork: BridgeNetwork | string; // for which bridge this token was created, eth or bsc (can't be amb)
  decimals: number;
  isNativeCoin: boolean;
  name: string;
  network: Network | string; // on which network this token was deployed
  symbol: CryptoCurrencyCode | undefined;
}

export interface FeeData {
  transferFee: BigNumber;
  bridgeFee: BigNumber;
  amount: BigNumber;
  signature: string;
}

export interface Config {
  tokens: { [symb: string]: ConfigToken };
  bridges: { [net: string]: { amb: string; side: string } };
}

export interface ConfigToken {
  isActive: boolean;
  name: string;
  symbol: CryptoCurrencyCode | undefined;
  logo: string;
  networks: { [net: string]: ConfigTokenNetwork };
}

export interface ConfigTokenNetwork {
  address: string;
  denomination: number;
  isPrimary: boolean;
  nativeCoin?: string;
}

export interface WithdrawParams {
  tokenFrom: Token;
  tokenTo: Token;
  toAddress: string;
  amountTokens: string;
  feeData: FeeData;
  bridge: ethers.Contract;
}
export interface RunWithdrawModel {
  withdrawParams: WithdrawParams;
  getGasFee: boolean;
}

export class AllowanceException extends Error {
  constructor(
    public token: Token,
    public amount: BigNumberish,
    public spenderAddress: string
  ) {
    super(
      `User must approve ${amount} of ${token.symbol} for ${spenderAddress} before withdrawing`
    );
  }
}
export interface DataForFeeModel {
  tokenFrom: Token;
  tokenTo: Token;
  amountTokens: string;
  isMax: boolean;
}
export interface GetFeeDataModel {
  bridgeConfig: Config;
  dataForFee: DataForFeeModel;
}

export interface GetBalanceModel {
  from: string;
  token: Token;
  ownerAddress: string;
}

export interface WithdrawDataModel {
  tokenFrom: Token;
  tokenTo: Token;
  selectedAccount: AccountDBModel;
  amountTokens: string;
  feeData: FeeData;
  gasFee?: boolean;
}

export interface CalculateGasFeeModel {
  bridgeConfig: Config;
  fromNetwork: string;
  tokenFrom: Token;
  tokenTo: Token;
  isMax: boolean;
  selectedAccount: AccountDBModel;
  amountTokens: string;
  feeData: FeeData;
}

export interface BridgeWithdrawModel {
  bridgeConfig: Config;
  fromNetwork: string;
  withdrawData: WithdrawDataModel;
}

export interface GetAllBridgeFeesProps {
  isMax: boolean;
  bridgeConfig: Config;
  fromNetwork: NetworksNames;
  selectedTokenFrom: Token;
  amountToBridge: string;
  selectedTokenDestination: Token;
  selectedWallet: AccountDBModel;
}
