import { TokenInfo } from '@utils/token';
import axios from 'axios';
import Config from '@constants/config';

const explorerApiV2Url = Config.EXPLORER_API_V2_URL;

export const getAllTokens = async (itemLength = 999): Promise<TokenInfo[]> => {
  try {
    const apiUrl = `${explorerApiV2Url}/tokens?pagesize=${itemLength}`;
    const response = await axios.get(apiUrl);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
