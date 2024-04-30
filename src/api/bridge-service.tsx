import axios from 'axios';
import Config from '@constants/config';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

const BRIDGE_TRANSACTIONS_HISTORY_URL = Config.BRIDGE_HISTORY_URL;

export const getBridgeHistory = async (
  address: string,
  limit = 20,
  page: string | number
): Promise<PaginatedResponseBody<BridgeTransactionHistoryDTO>> => {
  try {
    const preparedURL = `${BRIDGE_TRANSACTIONS_HISTORY_URL}/txHistory/${address}?limit=${limit}&page=${page}`;
    const response = await axios.get(preparedURL);

    const nextKey = response.data.pagination.hasNext
      ? response.data.pagination.next
      : null;

    return { data: response.data.data, next: nextKey };
  } catch (error) {
    throw error;
  }
};
