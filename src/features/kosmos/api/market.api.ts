import Config from '@constants/config';
import axios from 'axios';
import { MarketType, TxType } from '../types';

export async function getProtocolFee() {
  return axios
    .get(`${Config.MARKETPLACE_URL}/v2/api/fee/protocolFee`)
    .then((res) => +res.data[0].fee / 1000);
}

export async function getTokenPriceForChart(
  tokenAddress: string,
  dateFrom: number,
  dateTo: number,
  signal: AbortSignal
) {
  return axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/tokens-price?tokenAddress=${tokenAddress}&dateFrom=${dateFrom}&dateTo=${dateTo}&optimized=1`,
    { signal }
  );
}

export async function getSDAPriceForChart(
  marketId: string,
  dateFrom: number,
  dateTo: number,
  signal: AbortSignal
) {
  return axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/market-prices?marketId=${marketId}&dateFrom=${dateFrom}&dateTo=${dateTo}&optimized=1`,
    { signal }
  );
}

export async function getMarketTxs(
  marketId: string | undefined
): Promise<TxType[]> {
  const response = await axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/transactions/all/market?marketId=${marketId}`
  );

  return await response.data;
}

export async function getMarketData(id: string): Promise<MarketType> {
  const response = await axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/markets/${id}`
  );

  return await response.data;
}
