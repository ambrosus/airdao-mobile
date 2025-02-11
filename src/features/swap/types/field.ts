import { ethers } from 'ethers';
import { SwapToken } from './token';

export enum FIELD {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B'
}

type UIAllowanceType = 'increase' | 'increased' | 'suitable';

export type SelectedTokensKeys = keyof typeof FIELD;
export type SelectedTokensState = Record<SelectedTokensKeys, SwapToken | null>;
export type SelectedTokensAmountState = Record<SelectedTokensKeys, string>;
export type SelectedTokensBalanceState = Record<
  SelectedTokensKeys,
  ethers.BigNumber | null
>;

export type SelectedPairsState = Array<{
  pairAddress: string;
  token0: string;
  token1: string;
}>;

export type NonNullableSelectedTokensState = Record<
  SelectedTokensKeys,
  SwapToken
>;

export type UIBottomSheetInformationState = {
  priceImpact: number | null;
  minimumReceivedAmount: string | null;
  allowance: UIAllowanceType | null;
};

export type UIBottomSheetInformationKeys = keyof UIBottomSheetInformationState;

export type Settings = {
  slippageTolerance: string;
  deadline: string;
  multihops: boolean;
  extendedMode: boolean;
};

export type SettingsKeys = keyof Settings;
