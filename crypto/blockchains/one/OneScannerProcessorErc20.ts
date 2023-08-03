/**
 * https://docs.harmony.one/home/developers/api/methods/account-methods/hmy_getbalance
 * https://docs.harmony.one/home/developers/api/methods/transaction-related-methods/hmy_gettransactionshistory#api-v2
 */
import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';
import BlocksoftExternalSettings from '@crypto/common/BlocksoftExternalSettings';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import OneUtils from '@crypto/blockchains/one/ext/OneUtils';
import BlocksoftUtils from '@crypto/common/BlocksoftUtils';
import EthScannerProcessorErc20 from '@crypto/blockchains/eth/EthScannerProcessorErc20';

import OneTmpDS from './stores/OneTmpDS';
import config from '@constants/config';

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  blockTime: string;
  blockConfirmations: number;
  transactionDirection: string;
  addressFrom: string;
  addressFromBasic: string;
  addressTo: string;
  addressToBasic: string;
  addressAmount: number;
  transactionStatus: string;
  inputValue: string;
  transactionJson?: {
    nonce: string;
    gas: string;
    gasPrice: string;
    transactionIndex: string;
  };
  transactionFee?: string;
}

interface CacheTokens {
  [address: string]: { [tokenAddress: string]: number };
}

const CACHE_TOKENS: CacheTokens = {};

export default class OneScannerProcessorErc20 extends EthScannerProcessorErc20 {
  private _blocksToConfirm = 10;

  /**
   * @param {string} scanData.account.address
   * @param {string} scanData.account.walletHash
   * @return {Promise<[UnifiedTransaction]>}
   */
  // @ts-ignore
  async getTransactionsBlockchain(scanData: {
    account: { address: string; walletHash: string };
  }): Promise<UnifiedTransaction[]> {
    const { address } = scanData.account;
    const oneAddress = OneUtils.toOneAddress(address);
    BlocksoftCryptoLog.log(
      `${this._settings.currencyCode} OneScannerProcessorErc20.getTransactionsBlockchain started ${address} ${oneAddress}`
    );
    try {
      CACHE_TOKENS[address] = await OneTmpDS.getCache(address);
      const apiPath = BlocksoftExternalSettings.getStatic('ONE_SERVER');
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'hmyv2_getTransactionsHistory',
        params: [
          {
            address: oneAddress,
            pageIndex: 0,
            pageSize: 20,
            fullTx: true,
            txType: 'ALL',
            order: 'DESC'
          }
        ]
      };
      const res = await BlocksoftAxios._request(apiPath, 'POST', data);
      if (
        !res ||
        !res.data ||
        !res.data.result ||
        !res.data.result.transactions
      ) {
        return [];
      }
      const transactions: UnifiedTransaction[] = [];
      let firstTransaction: number | false = false;
      for (const tx of res.data.result.transactions) {
        if (
          typeof CACHE_TOKENS[address] !== 'undefined' &&
          typeof CACHE_TOKENS[address][this._tokenAddress] !== 'undefined'
        ) {
          const diff = tx.timestamp - CACHE_TOKENS[address][this._tokenAddress];
          const diffNow = (new Date().getTime() - tx.timestamp) / 60;
          if (diff < -20) {
            continue;
          }
          if (diff <= 0) {
            if (diffNow > 100) {
              continue;
            }
          }
        }
        if (!firstTransaction) {
          firstTransaction = tx.timestamp;
        }
        const transaction = await this._unifyTransaction(
          address,
          oneAddress,
          tx
        );
        if (transaction) {
          transactions.push(transaction);
        }
      }
      if (firstTransaction !== false) {
        CACHE_TOKENS[address][this._tokenAddress] = Number(firstTransaction);
        await OneTmpDS.saveCache(address, this._tokenAddress, firstTransaction);
      }
      return transactions;
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          `${this._settings.currencyCode} OneScannerProcessorErc20.getTransactionsBlockchain address ${address} error ${e.message}`
        );
      }
      BlocksoftCryptoLog.log(
        `${this._settings.currencyCode} OneScannerProcessorErc20.getTransactionsBlockchain address ${address} error ${e.message}`
      );
      return [];
    }
  }

  /**
   *
   * @param {string} address
   * @param {string} oneAddress
   * @param {Object} transaction
   * @param {string} transaction.blockHash
   * @param {string} transaction.blockNumber
   * @param {string} transaction.ethHash
   * @param {string} transaction.from
   * @param {string} transaction.gas
   * @param {string} transaction.gasPrice
   * @param {string} transaction.hash
   * @param {string} transaction.input "0x095ea7b3000000000000000000000000d0cb3e55449646c9735d53e83eea5eb7e97a52dcffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
   * @param {string} transaction.nonce
   * @param {string} transaction.shardID
   * @param {string} transaction.timestamp
   * @param {string} transaction.to
   * @param {string} transaction.toShardID
   * @param {string} transaction.value
   * @return  {Promise<UnifiedTransaction>}
   * @private
   */
  // @ts-ignore
  async _unifyTransaction(
    address: string,
    oneAddress: string,
    transaction: {
      transactionIndex: string;
      blockHash: string;
      blockNumber: string;
      ethHash: string;
      from: string;
      gas: string;
      gasPrice: string;
      hash: string;
      input: string;
      nonce: string;
      shardID: string;
      timestamp: string;
      to: string;
      toShardID: string;
      value: string;
    }
  ): Promise<UnifiedTransaction | false> {
    const contractEvents = await this._token.getPastEvents('Transfer', {
      fromBlock: transaction.blockNumber,
      toBlock: transaction.blockNumber
    });
    if (!contractEvents) {
      return false;
    }
    let foundEventFrom = false;
    let foundEventTo = false;
    let foundEventSelf = false;
    let addressAmount = 0;
    for (const tmp of contractEvents) {
      if (tmp.transactionHash !== transaction.ethHash) {
        continue;
      }
      if (tmp.returnValues.to.toLowerCase() === address.toLowerCase()) {
        if (tmp.returnValues.from.toLowerCase() === address.toLowerCase()) {
          foundEventSelf = tmp;
        } else {
          foundEventTo = tmp;
          addressAmount = addressAmount * 1 + tmp.returnValues.value * 1;
        }
      } else if (
        tmp.returnValues.from.toLowerCase() === address.toLowerCase()
      ) {
        foundEventFrom = tmp;
        addressAmount = addressAmount * 1 - tmp.returnValues.value * 1;
      }
    }
    if (!foundEventSelf && !foundEventTo && !foundEventFrom) {
      return false;
    }

    let formattedTime = transaction.timestamp;
    try {
      formattedTime = BlocksoftUtils.toDate(transaction.timestamp);
    } catch (e: any) {
      e.message +=
        ' timestamp error transaction data ' + JSON.stringify(transaction);
      throw e;
    }

    const confirmations =
      // tslint:disable-next-line:radix
      (new Date().getTime() - parseInt(transaction.timestamp)) / 60;
    let transactionStatus = 'confirming';
    if (confirmations > 2) {
      transactionStatus = 'success';
    }

    const tx: UnifiedTransaction = {
      transactionHash: transaction.ethHash.toLowerCase(),
      blockHash: transaction.blockHash,
      blockNumber: +transaction.blockNumber,
      blockTime: formattedTime,
      blockConfirmations: confirmations,
      transactionDirection:
        addressAmount <= 0 ? (foundEventTo ? 'outcome' : 'self') : 'income',
      addressFrom: foundEventFrom ? transaction.from : '',
      addressFromBasic: transaction.from.toLowerCase(),
      addressTo: foundEventTo ? transaction.to : '',
      addressToBasic: transaction.to,
      addressAmount,
      transactionStatus,
      inputValue: transaction.input
    };
    tx.transactionJson = {
      nonce: transaction.nonce,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      transactionIndex: transaction.transactionIndex
    };
    tx.transactionFee = BlocksoftUtils.mul(
      transaction.gas,
      transaction.gasPrice
    ).toString();

    return tx;
  }
}
