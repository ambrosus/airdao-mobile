import axios from 'axios';
import Config from '@constants/config';
import { Config as BridgeConfig } from '@lib/bridgeSDK/models/types';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

const BRIDGE_TRANSACTIONS_HISTORY_URL = Config.BRIDGE_HISTORY_URL;

export const getBridgeHistory = async (
  address: string
): Promise<BridgeTransactionHistoryDTO[]> => {
  try {
    const preparedURL = `${BRIDGE_TRANSACTIONS_HISTORY_URL}/txHistory?userAddress=${address}`;
    const response = await axios.get(preparedURL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBridgeParams = async (): Promise<BridgeConfig> => {
  const apiUrl = Config.BRIDGE_CONFIG;
  try {
    const res = await axios.get(apiUrl);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bridgeService = {
  getBridgeParams,
  getBridgeHistory
};
