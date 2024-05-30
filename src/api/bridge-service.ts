import axios from 'axios';
import { Config as BridgeConfig } from '@api/bridge/sdk/types';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import Config from '@constants/config';
import { bridgeSDK } from '@api/bridge/sdk/BridgeSDK';

interface BridgeParamsModel {
  data: BridgeConfig;
}

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

const getBridgeParams = async (): Promise<BridgeParamsModel> => {
  const apiUrl = Config.BRIDGE_CONFIG;
  try {
    const res = await axios.get(apiUrl);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bridgeService = {
  bridgeSDK,
  getBridgeParams,
  getBridgeHistory
};
