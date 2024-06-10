import Config from '@constants/config';
import { FieldSelectedTokens } from './types';
import { DEX_SUPPORTED_TOKENS } from '../entities/tokens';
import { FIELD } from '../types/fields';

const isTestnet = Config.env === 'testnet';

export const INITIAL_SLIPPAGE_TOLERANCE = 0.5;

export const INITIAL_SELECTED_TOKENS: FieldSelectedTokens = {
  INPUT: DEX_SUPPORTED_TOKENS.default[isTestnet ? 'testnet' : 'production'],
  OUTPUT: null
};

export const INITIAL_TOKENS_AMOUNT: Record<keyof typeof FIELD, string> = {
  INPUT: '',
  OUTPUT: ''
};
