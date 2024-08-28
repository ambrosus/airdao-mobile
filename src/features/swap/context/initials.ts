import {
  SelectedTokensAmountState,
  SelectedTokensState,
  Settings,
  UIBottomSheetInformationState
} from '../types';
import { SWAP_SUPPORTED_TOKENS } from '../entities';
import { environment } from '@utils/environment';

export const INITIAL_SLIPPAGE_TOLLERANCE = '0.5';
export const INITIAL_DEADLINE = '20';

export const INITAL_SETTINGS: Settings = {
  slippageTolerance: INITIAL_SLIPPAGE_TOLLERANCE,
  deadline: INITIAL_DEADLINE,
  //temporarily turn off multihops
  multihops: false,
  extendedMode: false
};

export const INITIAL_SELECTED_TOKENS: SelectedTokensState = {
  TOKEN_A: SWAP_SUPPORTED_TOKENS.default[environment],
  TOKEN_B: null
};

export const INITIAL_SELECTED_TOKENS_AMOUNT: SelectedTokensAmountState = {
  TOKEN_A: '',
  TOKEN_B: ''
};

export const INITAL_UI_BOTTOM_SHEET_INFORMATION: UIBottomSheetInformationState =
  {
    priceImpact: null,
    minimumReceivedAmount: null,
    lpFee: null,
    allowance: null
  };
