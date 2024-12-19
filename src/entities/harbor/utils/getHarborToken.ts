import { API } from '@api/api';
import { TokenUtils } from '@utils';
import Config from '@constants/config';
import { EMPTY_TOKEN } from '@entities/harbor/constants';

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
