import axios from 'axios';
import Config from '@constants/config';
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

export const bridgeService = { getBridgeHistory };
