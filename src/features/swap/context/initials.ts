import {
  SelectedTokensAmountState,
  SelectedTokensState,
  UIBottomSheetInformationState
} from '../types';
import { SWAP_SUPPORTED_TOKENS } from '../entities';
import { environment } from '@utils/environment';

export const INITIAL_SELECTED_TOKENS: SelectedTokensState = {
  TOKEN_A: SWAP_SUPPORTED_TOKENS.default[environment],
  TOKEN_B: null
};

export const INITIAL_SELECTED_TOKENS_AMOUNT: SelectedTokensAmountState = {
  TOKEN_A: '',
  TOKEN_B: ''
};

export const INITIAL_SLIPPAGE_TOLLERANCE = '0.5';

export const INITAL_UI_BOTTOM_SHEET_INFORMATION: UIBottomSheetInformationState =
  {
    priceImpact: null,
    minimumReceivedAmount: null,
    lpFee: null
  };
