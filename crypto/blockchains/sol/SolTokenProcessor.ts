/**
 * @version 0.52
 */
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftExternalSettings from '@crypto/common/BlocksoftExternalSettings';
import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';
import { AxiosResponse } from 'axios';

interface TokenDetails {
  currencyCodePrefix: string;
  currencyCode: string;
  currencyName: string;
  tokenType: string;
  tokenAddress: string;
  tokenDecimals: number;
  icon?: string;
  description?: string;
  coingeckoId?: string;
  provider: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  logoURI?: string;
  website?: string;
}

export default class SolTokenProcessor {
  /**
   * @param {string} tokenAddress
   * @returns {Promise<TokenDetails | boolean>}
   */
  async getTokenDetails(tokenAddress: string): Promise<TokenDetails | boolean> {
    const link = await BlocksoftExternalSettings.get('SOL_TOKENS_LIST');
    // @ts-ignore
    const res: AxiosResponse<any> = await BlocksoftAxios.get(link);
    if (!res || typeof res.data.tokens === 'undefined' || !res.data.tokens) {
      return false;
    }

    let tmp: TokenDetails | false = false;
    for (const token of res.data.tokens) {
      if (token.address === tokenAddress) {
        if (token.chainId !== 101) continue;
        tmp = token;
        break;
      }
    }
    if (tmp) {
      const tokenDetails: TokenDetails = {
        currencyCodePrefix: 'CUSTOM_SOL_',
        currencyCode: tmp.symbol || '',
        currencyName: tmp.name || '',
        tokenType: 'SOL',
        tokenAddress,
        tokenDecimals: tmp.decimals || 0,
        icon: tmp.logoURI || '',
        description: tmp.website || '',
        coingeckoId: tmp.coingeckoId || '',
        provider: 'sol'
      };
      return tokenDetails;
    }

    let decimals = 6;
    try {
      const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          tokenAddress,
          {
            encoding: 'jsonParsed'
          }
        ]
      };
      const response = await BlocksoftAxios._request(apiPath, 'POST', data);
      if (
        response &&
        response.data &&
        typeof response.data.result !== 'undefined' &&
        typeof response.data.result.value !== 'undefined'
      ) {
        decimals = response.data.result.value.data.parsed.info.decimals;
      } else {
        return false;
      }
      if (
        typeof response.data.result.value.owner === 'undefined' ||
        response.data.result.value.owner !==
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ) {
        return false;
      }
      if (
        typeof response.data.result.value.data.program === 'undefined' ||
        response.data.result.value.data.program !== 'spl-token'
      ) {
        return false;
      }
      decimals = response.data.result.value.data.parsed.info.decimals;
    } catch (e: any) {
      BlocksoftCryptoLog.log(
        'SolTokenProcessor getTokenDetails tokenAddress ' +
          tokenAddress +
          ' error ' +
          e.message
      );
      return false;
    }

    return {
      currencyCodePrefix: 'CUSTOM_SOL_',
      currencyCode: 'UNKNOWN_TOKEN_' + tokenAddress,
      currencyName: tokenAddress,
      tokenType: 'SOL',
      tokenAddress,
      tokenDecimals: decimals,
      provider: 'sol'
    };
  }
}
