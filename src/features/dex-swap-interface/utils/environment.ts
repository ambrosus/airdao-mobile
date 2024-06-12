import Config from '@constants/config';
import { DEX_SUPPORTED_TOKENS } from '../entities/tokens';

export const environment = Config.env === 'testnet' ? 'testnet' : 'production';

export const DEX_DEFAULT_TOKEN_BY_ENVIRONMENT =
  DEX_SUPPORTED_TOKENS.default[environment];
