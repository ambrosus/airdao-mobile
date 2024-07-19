import Config from '@constants/config';
import axios from 'axios';

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
    `${Config.MARKETPLACE_URL}/v2/api/tokens-price?tokenAddress=${tokenAddress}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
    `${Config.MARKETPLACE_URL}/v2/api/market-prices?marketId=${marketId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    { signal }
  );
}

export async function getMarketTxs(marketId: string) {
  return axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/transactions/all/market?marketId=${marketId}`
  );
}

export async function getMarketData(id: string) {
  return axios.get(`${Config.MARKETPLACE_URL}/v2/api/markets/${id}`);
}
