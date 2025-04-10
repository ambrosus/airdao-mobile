import { toUpper } from 'lodash';
import { DatabaseTokenModel } from '@constants/allToken';
import Config from '@constants/config';

export const getTokenNameFromDatabase = (address: string): string =>
  Config.ALL_TOKENS.find(
    (token: DatabaseTokenModel) => token.address === address
  )?.name ?? 'unknown';

export const getTokenSymbolFromDatabase = (
  address: string,
  _toUpperCase?: boolean
): string =>
  Config.ALL_TOKENS.find(
    (token: DatabaseTokenModel) =>
      (_toUpperCase ? toUpper(token.address) : token.address) === address
  )?.symbol ?? 'unknown';
