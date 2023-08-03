/**
 * @version 0.52
 */
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import AirDAOAxios from '@crypto/common/AirDAOAxios';
import BlocksoftUtils from '@crypto/common/AirDAOUtils';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

import SolTmpDS from '@crypto/blockchains/sol/stores/SolTmpDS';

import SolUtils from '@crypto/blockchains/sol/ext/SolUtils';
import config from '@constants/config';

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  blockTime: Date;
  blockConfirmations: number;
  transactionDirection: 'income' | 'outcome' | 'swap_income' | 'swap_outcome';
  addressFrom: string;
  addressTo: string;
  addressAmount: string;
  transactionStatus: 'new' | 'success' | 'confirming' | 'fail';
  transactionFee: number;
  transactionJson?: { memo: string };
}

const CACHE_FROM_DB: Record<string, any> = {};
const CACHE_TXS: Record<string, { data: any; now: number }> = {};
const CACHE_VALID_TIME = 120000;
let CACHE_LAST_BLOCK = 0;

export default class SolScannerProcessor {
  private _settings: any;
  private tokenAddress: string;

  constructor(settings: any) {
    this._settings = settings;
    this.tokenAddress =
      typeof settings.tokenAddress !== 'undefined' ? settings.tokenAddress : '';
  }

  async getBalanceBlockchain(
    address: string
  ): Promise<{ balance: number; provider: string } | false> {
    address = address.trim();
    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' SolScannerProcessor getBalanceBlockchain address ' +
        address
    );

    let balance = 0;
    try {
      await SolUtils.getEpoch();

      const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      };
      const res = await AirDAOAxios._request(apiPath, 'POST', data);

      if (
        typeof res.data.result === 'undefined' ||
        typeof res.data.result.value === 'undefined'
      ) {
        return false;
      }
      if (
        typeof res.data.result.context !== 'undefined' &&
        typeof res.data.result.context.slot !== 'undefined'
      ) {
        CACHE_LAST_BLOCK = res.data.result.context.slot * 1;
      }
      balance = res.data.result.value;
    } catch (e: any) {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' SolScannerProcessor getBalanceBlockchain address ' +
          address +
          ' error ' +
          e.message
      );
      return false;
    }
    return { balance, provider: 'solana-api' };
  }

  async getTransactionsBlockchain(scanData: {
    account: { address: string };
  }): Promise<UnifiedTransaction[] | false> {
    const address = scanData.account.address.trim();
    const lastHashVar = address + this.tokenAddress;
    this._cleanCache();
    try {
      if (typeof CACHE_FROM_DB[lastHashVar] === 'undefined') {
        CACHE_FROM_DB[lastHashVar] = await SolTmpDS.getCache(lastHashVar);
      }

      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getConfirmedSignaturesForAddress2',
        params: [address, { limit: 100 }]
      };
      if (
        CACHE_FROM_DB[lastHashVar] &&
        typeof CACHE_FROM_DB[lastHashVar].last_hash !== 'undefined'
      ) {
        data.params[1].until = CACHE_FROM_DB[lastHashVar].last_hash;
      }
      const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
      const res = await AirDAOAxios._request(apiPath, 'POST', data);
      if (typeof res.data.result === 'undefined' || !res.data.result) {
        return false;
      }

      const transactions = await this._unifyTransactions(
        address,
        res.data.result,
        lastHashVar
      );
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' SolScannerProcessor.getTransactions finished ' +
          address
      );
      return transactions;
    } catch (e: any) {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' SolScannerProcessor getTransactionsBlockchain address ' +
          address +
          ' error ' +
          e.message
      );
      return false;
    }
  }

  private async _unifyTransactions(
    address: string,
    result: any[],
    lastHashVar: string
  ): Promise<UnifiedTransaction[]> {
    const transactions: UnifiedTransaction[] = [];
    let lastHash = false;
    let hasError = false;
    for (const tx of result) {
      try {
        const transaction = await this._unifyTransaction(address, tx);
        if (transaction) {
          transactions.push(transaction);
          if (
            transaction.transactionStatus === 'success' &&
            !lastHash &&
            !hasError
          ) {
            lastHash = transaction.transactionHash;
          }
        }
      } catch (e: any) {
        hasError = true;
        if (e.message.indexOf('request failed') === -1) {
          if (config.debug.appErrors) {
            console.log(
              this._settings.currencyCode +
                ' SolScannerProcessor._unifyTransactions ' +
                tx.signature +
                ' error ' +
                e.message
            );
          }
          AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' SolScannerProcessor._unifyTransactions ' +
              tx.signature +
              ' error ' +
              e.message
          );
        }
      }
    }

    if (lastHash) {
      if (!CACHE_FROM_DB[lastHashVar]) {
        CACHE_FROM_DB[lastHashVar] = { last_hash: lastHash };
        await SolTmpDS.saveCache(lastHashVar, 'last_hash', lastHash);
      } else if (typeof CACHE_FROM_DB[lastHashVar].last_hash === 'undefined') {
        CACHE_FROM_DB[lastHashVar].last_hash = lastHash;
        await SolTmpDS.saveCache(lastHashVar, 'last_hash', lastHash);
      } else {
        CACHE_FROM_DB[lastHashVar].last_hash = lastHash;
        await SolTmpDS.updateCache(lastHashVar, 'last_hash', lastHash);
      }
    }
    return transactions;
  }

  private _cleanCache() {
    const now = new Date().getTime();
    for (const key in CACHE_TXS) {
      const t = now - CACHE_TXS[key].now;
      if (t > CACHE_VALID_TIME) {
        delete CACHE_TXS[key];
      }
    }
  }

  private async _unifyTransaction(
    address: string,
    transaction: any
  ): Promise<UnifiedTransaction | false> {
    const data = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getConfirmedTransaction',
      params: [transaction.signature, { encoding: 'jsonParsed' }]
    };

    let additional: any;
    if (typeof CACHE_TXS[transaction.signature] === 'undefined') {
      const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
      try {
        const res = await AirDAOAxios._request(apiPath, 'POST', data);
        if (typeof res.data.result === 'undefined' || !res.data.result) {
          return false;
        }
        additional = res.data.result;
        CACHE_TXS[transaction.signature] = {
          data: additional,
          now: new Date().getTime()
        };
      } catch (e: any) {
        if (config.debug.cryptoErrors) {
          console.log(
            this._settings.currencyCode +
              ' SolScannerProcessor._unifyTransaction ' +
              transaction.signature +
              ' request error ' +
              e.message
          );
        }
        throw e;
      }
    } else {
      additional = CACHE_TXS[transaction.signature].data;
    }

    let addressFrom = false;
    let addressTo = false;
    let addressAmount = '0';
    let anyFromAddress = false;
    let anyToAddress = false;

    const indexedPre: Record<string, number> = {};
    const indexedPost: Record<string, number> = {};
    const indexedCreated: Record<string, string> = {};
    const indexedAssociated: Record<string, any> = {};

    if (this.tokenAddress) {
      for (const tmp of additional.meta.preTokenBalances) {
        if (tmp.mint !== this.tokenAddress) continue;
        const realIndex = tmp.accountIndex;
        indexedPre[realIndex] = tmp.uiTokenAmount.amount;
      }

      for (const tmp of additional.meta.postTokenBalances) {
        if (tmp.mint !== this.tokenAddress) continue;
        const realIndex = tmp.accountIndex;
        indexedPost[realIndex] = tmp.uiTokenAmount.amount;
      }

      for (const tmp of additional.transaction.message.instructions) {
        if (tmp.program !== 'spl-associated-token-account') continue;
        indexedCreated[tmp.parsed.info.account] = tmp.parsed.info.wallet;
      }

      for (
        let i = 0, ic = additional.transaction.message.accountKeys.length;
        i < ic;
        i++
      ) {
        const tmpAddress = additional.transaction.message.accountKeys[i];
        if (tmpAddress.pubkey === '11111111111111111111111111111111') continue;
        const sourceAssociatedTokenAddress =
          await SolUtils.findAssociatedTokenAddress(
            tmpAddress.pubkey,
            this.tokenAddress
          );
        indexedAssociated[sourceAssociatedTokenAddress] = tmpAddress;
      }
    } else {
      // do nothing!
    }

    let anySigner = false;
    let addressAmountPlus = false;
    for (
      let i = 0, ic = additional.transaction.message.accountKeys.length;
      i < ic;
      i++
    ) {
      let tmpAddress = additional.transaction.message.accountKeys[i];
      if (tmpAddress.pubkey === '11111111111111111111111111111111') continue;
      let tmpAmount = '0';
      if (typeof indexedAssociated[tmpAddress.pubkey] !== 'undefined') {
        tmpAddress = indexedAssociated[tmpAddress.pubkey];
      }
      if (this.tokenAddress) {
        const to = typeof indexedPost[i] !== 'undefined' ? indexedPost[i] : 0;
        const from = typeof indexedPre[i] !== 'undefined' ? indexedPre[i] : 0;
        tmpAmount = BlocksoftUtils.diff(to, from).toString();
      } else {
        tmpAmount = BlocksoftUtils.diff(
          additional.meta.postBalances[i],
          additional.meta.preBalances[i]
        ).toString();
      }

      if (tmpAddress.pubkey && tmpAddress.signer) {
        anySigner = tmpAddress.pubkey;
      }

      if (tmpAmount === '0') continue;

      if (
        tmpAddress.pubkey === address ||
        (typeof indexedCreated[tmpAddress.pubkey] !== 'undefined' &&
          indexedCreated[tmpAddress.pubkey] === address)
      ) {
        if (tmpAmount.indexOf('-') === -1) {
          addressTo = tmpAddress.pubkey;
          addressAmount = tmpAmount;
          addressAmountPlus = true;
        } else {
          addressFrom = tmpAddress.pubkey;
          addressAmount = tmpAmount.replace('-', '');
        }
      } else {
        if (tmpAddress.signer) {
          anyFromAddress = tmpAddress.pubkey;
        } else {
          anyToAddress = tmpAddress.pubkey;
        }
      }
    }

    if (!addressFrom && anySigner !== addressTo) {
      addressFrom = anySigner;
    }
    if (!addressFrom && !addressTo) {
      return false;
    }
    if (anyFromAddress && !addressFrom) {
      addressFrom = anyFromAddress;
    }
    if (anyToAddress && !addressTo) {
      addressTo = anyToAddress;
    }
    if (!addressTo) {
      addressTo = 'System';
    }

    let formattedTime = transaction.blockTime;
    try {
      formattedTime = BlocksoftUtils.toDate(transaction.blockTime);
    } catch (e: any) {
      e.message +=
        ' timestamp error transaction2 data ' + JSON.stringify(transaction);
      throw e;
    }
    let transactionStatus: 'new' | 'success' | 'confirming' | 'fail' = 'new';
    if (transaction.confirmationStatus === 'finalized') {
      transactionStatus = 'success';
    } else if (transaction.confirmationStatus === 'confirmed') {
      transactionStatus = 'confirming';
    }
    if (typeof transaction.err !== 'undefined' && transaction.err) {
      transactionStatus = 'fail';
    }

    let transactionDirection: UnifiedTransaction['transactionDirection'] =
      addressFrom === address ? 'outcome' : 'income';
    if (!addressFrom && anySigner === addressTo) {
      if (addressAmountPlus) {
        transactionDirection = 'swap_income';
      } else {
        transactionDirection = 'swap_outcome';
      }
    }
    const blockConfirmations =
      CACHE_LAST_BLOCK > 0
        ? Math.round(CACHE_LAST_BLOCK - additional.slot * 1)
        : 0;
    const tx: UnifiedTransaction = {
      transactionHash: transaction.signature,
      blockHash: additional.transaction.message.recentBlockhash,
      blockNumber: transaction.slot,
      blockTime: formattedTime,
      blockConfirmations,
      transactionDirection,
      addressFrom: addressFrom === address ? '' : addressFrom,
      addressTo: addressTo === address ? '' : addressTo,
      addressAmount,
      transactionStatus,
      transactionFee: additional.meta.fee
    };
    if (typeof transaction.memo !== 'undefined' && transaction.memo) {
      tx.transactionJson = { memo: transaction.memo };
    }
    return tx;
  }
}
