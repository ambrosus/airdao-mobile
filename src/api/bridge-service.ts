import axios from 'axios';
import { Config as BridgeConfig } from '@api/bridge/sdk/types';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import Config from '@constants/config';

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
  const ProdApi =
    'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/28ef2bb7d101581436e2fd2deba740d5698795a8/contracts/configs/main.json';
  const TestNetApi =
    'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/dev/contracts/configs/test.json';

  const testNet = false;
  const apiUrl = testNet ? TestNetApi : ProdApi;
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
