import axios from 'axios';
import Config from '@constants/config';

export async function fetchMarketTokens(controller?: AbortController) {
  const signal = controller?.signal;
  return await axios.get(`${Config.MARKETPLACE_URL}/v2/api/tokens`, { signal });
}
