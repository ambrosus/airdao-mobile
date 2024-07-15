import axios from 'axios';
import Config from '@constants/config';

export async function fetchActiveMarkets(controller?: AbortController) {
  const signal = controller?.signal;
  return await axios.get(`${Config.MARKETPLACE_URL}/v2/api/live-markets`, {
    signal
  });
}

export async function fetchClosedMarkets(controller?: AbortController) {
  const signal = controller?.signal;
  return await axios.get(`${Config.MARKETPLACE_URL}/v2/api/closed-markets`, {
    signal
  });
}

export async function fetchMarketTokens(controller?: AbortController) {
  const signal = controller?.signal;
  return await axios.get(`${Config.MARKETPLACE_URL}/v2/api/tokens`, { signal });
}

export async function fetchMarketTransactions(
  version: string,
  address: string,
  controller?: AbortController
) {
  const signal = controller?.signal;

  return await axios.get(
    `${Config.MARKETPLACE_URL}/${version}/api/transactions/bonded/${address}`,
    { signal }
  );
}
