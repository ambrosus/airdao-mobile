import axios from 'axios';

export async function getProtocolFee() {
  return axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/v2/api/fee/protocolFee`)
    .then((res) => +res.data[0].fee / 1000);
}

export async function getTokenPriceForChart(
  tokenAddress: string,
  dateFrom: number,
  dateTo: number
) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/v2/api/tokens-price?tokenAddress=${tokenAddress}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
}

export async function getSDAPriceForChart(
  marketId: string,
  dateFrom: number,
  dateTo: number
) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/v2/api/market-prices?marketId=${marketId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
}

export async function getMarketTxs(marketId: string) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/v2/api/transactions/all/market?marketId=${marketId}`
  );
}

export async function getMarketData(id: string) {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/v2/api/markets/${id}`);
}
