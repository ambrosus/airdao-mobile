import { API } from '@api/api';
import Config from '@constants/config';
import { EMPTY_TOKEN } from '@entities/harbor/constants';
import { TokenUtils } from '@utils';

export const getHarborToken = async (address: string) => {
  try {
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
  } catch (error) {
    return null;
  }
};
