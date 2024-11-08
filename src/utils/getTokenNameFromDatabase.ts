import Config from '@constants/config';
import { TokenDTO } from '@models';

export const getTokenNameFromDatabase = (address: string): string =>
  Config.ALL_TOKENS.find((token: TokenDTO) => token.address === address)
    ?.name ?? 'unknown';