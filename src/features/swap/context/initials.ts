import { SelectedTokensAmountState, SelectedTokensState } from '../types';
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
