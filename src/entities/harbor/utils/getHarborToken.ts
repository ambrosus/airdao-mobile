import { API } from '@api/api';
import { TokenUtils } from '@utils/token';
import Config from '@constants/config';
import { CryptoCurrencyCode } from '@appTypes';
import { Token } from '@models';

export const EMPTY_TOKEN = new Token(
  {
    address: '',
    decimals: 18,
    name: 'Staked AMB',
    symbol: CryptoCurrencyCode.stAMB,
    isNativeCoin: false,
    balance: {
      formattedBalance: '0',
      wei: '0',
      ether: 0
    },
    tokenNameFromDatabase: 'Staked AMB'
  },
  TokenUtils
);

export const getHarborToken = async (address: string) => {
  const tokens = await API.explorerService.getTransactionsOfOwnAccount(
    address,
    100,
    100,
    TokenUtils
  );
  return (
    tokens.data.tokens.find(
      (token) => token.address === Config.ST_AMB_ADDRESS
    ) || EMPTY_TOKEN
  );
};
