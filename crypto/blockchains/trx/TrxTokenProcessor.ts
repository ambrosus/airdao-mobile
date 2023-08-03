/**
 * @version 0.5
 * https://apilist.tronscan.org/api/contract?contract=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
 * [ { address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', balance: 7208332710, verify_status: 0, balanceInUsd: 0, trxCount: 758742, date_created: 1555400628000, creator: [Object] } ] }
 */
import BlocksoftAxios from '../../common/BlocksoftAxios';

interface TokenDetails {
  currencyCodePrefix: string;
  currencyCode: string;
  currencyName: string;
  tokenType: string;
  tokenAddress: string;
  tokenDecimals: number;
  icon: string;
  description: string;
  provider: string;
}

interface TronscanResponse {
  data: {
    symbol: string;
    name: string;
    contract_address: string;
    decimals: number;
    icon_url: string;
    token_desc: string;
    abbr: string;
    tokenID: string;
    precision: number;
    imgUrl: string;
    description: string;
  }[];
}

export default class TrxTokenProcessor {
  private _tokenTronscanPath20: string;
  private _tokenTronscanPath10: string;

  constructor() {
    this._tokenTronscanPath20 =
      'https://apilist.tronscan.org/api/token_trc20?contract=';
    this._tokenTronscanPath10 = 'https://apilist.tronscan.org/api/token?id=';
  }

  /**
   * https://apilist.tronscan.org/api/token_trc20?contract=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
   * @param {string} tokenAddress
   * @returns {Promise<TokenDetails | boolean>}
   */
  async getTokenDetails(tokenAddress: string): Promise<TokenDetails | boolean> {
    if (tokenAddress[0] === 'T') {
      const res = await BlocksoftAxios.get<TronscanResponse>(
        this._tokenTronscanPath20 + tokenAddress
      );
      if (typeof res.data[0] !== 'undefined') {
        const tmp = res.data[0];
        return {
          currencyCodePrefix: 'CUSTOM_TRX_',
          currencyCode: tmp.symbol,
          currencyName: tmp.name,
          tokenType: 'TRX', // 'TRX'
          tokenAddress: tmp.contract_address,
          tokenDecimals: tmp.decimals,
          icon: tmp.icon_url,
          description: tmp.token_desc,
          provider: 'tronscan20'
        };
      }
    } else {
      const res = await BlocksoftAxios.get<TronscanResponse>(
        this._tokenTronscanPath10 + tokenAddress
      );
      if (typeof res.data[0] !== 'undefined') {
        const tmp = res.data[0];
        return {
          currencyCodePrefix: 'CUSTOM_TRX_',
          currencyCode: tmp.abbr,
          currencyName: tmp.name,
          tokenType: 'TRX', // 'TRX'
          tokenAddress: tmp.tokenID,
          tokenDecimals: tmp.precision,
          icon: tmp.imgUrl,
          description: tmp.description,
          provider: 'tronscan10'
        };
      }
    }
    return false;
  }
}
