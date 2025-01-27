import { toUpper } from 'lodash';
import Config from '@constants/config';
import { TokenDTO } from '@models';

export const getTokenNameFromDatabase = (address: string): string =>
  Config.ALL_TOKENS.find((token: TokenDTO) => token.address === address)
    ?.name ?? 'unknown';

export const getTokenSymbolFromDatabase = (
  address: string,
  _toUpperCase?: boolean
): string =>
  Config.ALL_TOKENS.find(
    (token: TokenDTO) =>
      (_toUpperCase ? toUpper(token.address) : token.address) === address
  )?.symbol ?? 'unknown';
