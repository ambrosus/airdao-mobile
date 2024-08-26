import axios from 'axios';
import Config from '@constants/config';
import { MarketType } from '../types';

export async function fetchActiveMarkets(): Promise<MarketType[]> {
  const response = await axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/live-markets`
  );

  return await response.data;
}

export async function fetchClosedMarkets(): Promise<MarketType[]> {
  const response = await axios.get(
    `${Config.MARKETPLACE_URL}/v2/api/closed-markets`
  );

  return await response.data;
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
