/**
 * @version 0.52
 */
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import SolScannerProcessor from '@crypto/blockchains/sol/SolScannerProcessor';
import { AxiosResponse } from 'axios';

interface ParsedInfo {
  state?: string;
  mint: string;
  tokenAmount: number;
}

interface CacheBalances {
  [address: string]: {
    [tokenAddress: string]: {
      amount: number;
    };
    time: number;
  };
}

const CACHE_BALANCES: CacheBalances = {};
const CACHE_VALID_TIME = 30000; // 30 seconds

export default class SolScannerProcessorSpl extends SolScannerProcessor {
  /**
   * @param {string} address
   * @return {Promise<{balance: number; provider: string} | false>}
   */
  async getBalanceBlockchain(
    address: string
  ): Promise<{ balance: number; provider: string } | false> {
    address = address.trim();
    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' SolScannerProcessorSpl getBalanceBlockchain address ' +
        address
    );

    const now = new Date().getTime();
    let balance = 0;
    try {
      if (
        typeof CACHE_BALANCES[address] === 'undefined' ||
        typeof CACHE_BALANCES[address].time === 'undefined' ||
        now - CACHE_BALANCES[address].time < CACHE_VALID_TIME
      ) {
        CACHE_BALANCES[address] = {};
        const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');

        const data = {
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            address,
            {
              programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            },
            { encoding: 'jsonParsed', commitment: 'processed' }
          ]
        };

        // @ts-ignore
        const res: AxiosResponse<any, any> = await BlocksoftAxios._request(
          apiPath,
          'POST',
          data
        );
        if (
          res.data === false ||
          typeof res.data.result === 'undefined' ||
          typeof res.data.result.value === 'undefined'
        ) {
          return false;
        }
        for (const account of res.data.result.value) {
          if (typeof account.account === 'undefined') continue;
          if (
            typeof account.account.data.program === 'undefined' ||
            account.account.data.program !== 'spl-token'
          )
            continue;
          const parsed: ParsedInfo = account.account.data.parsed.info;
          if (
            typeof parsed.state === 'undefined' ||
            parsed.state !== 'initialized'
          )
            continue;
          CACHE_BALANCES[address][parsed.mint] = { amount: parsed.tokenAmount }; // "amount": "1606300", "decimals": 6, "uiAmount": 1.6063, "uiAmountString": "1.6063"
        }
        CACHE_BALANCES[address].time = now;
      }
      if (
        typeof CACHE_BALANCES[address][this.tokenAddress] === 'undefined' ||
        typeof CACHE_BALANCES[address][this.tokenAddress].amount === 'undefined'
      ) {
        balance = 0;
      } else {
        balance = CACHE_BALANCES[address][this.tokenAddress].amount;
      }
    } catch (e: any) {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ` SolScannerProcessorSpl getBalanceBlockchain address ` +
          `${address} ` +
          ` error ${e.message}`
      );
      return false;
    }
    return { balance, provider: 'solana-api' };
  }
}
