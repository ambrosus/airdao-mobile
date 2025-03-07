import {
  SelectedTokensAmountState,
  Settings,
  UIBottomSheetInformationState
} from '../types';

export const INITIAL_SLIPPAGE_TOLERANCE = '0.50';
export const INITIAL_DEADLINE = '20';

export const INITIAL_SETTINGS: Settings = {
  slippageTolerance: INITIAL_SLIPPAGE_TOLERANCE,
  deadline: INITIAL_DEADLINE,
  multihops: true,
  extendedMode: false
};

export const INITIAL_SELECTED_TOKENS_AMOUNT: SelectedTokensAmountState = {
  TOKEN_A: '',
  TOKEN_B: ''
};

export const INITIAL_UI_BOTTOM_SHEET_INFORMATION: UIBottomSheetInformationState =
  {
    priceImpact: null,
    minimumReceivedAmount: null,
    allowance: null
  };
