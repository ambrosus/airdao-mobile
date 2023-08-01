/**
 * https://docs.harmony.one/home/developers/api/methods/account-methods/hmy_getbalance
 * https://docs.harmony.one/home/developers/api/methods/transaction-related-methods/hmy_gettransactionshistory#api-v2
 */
import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';
import BlocksoftExternalSettings from '@crypto/common/BlocksoftExternalSettings';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import OneUtils from '@crypto/blockchains/one/ext/OneUtils';
import BlocksoftUtils from '@crypto/common/BlocksoftUtils';
import config from '@constants/config';

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  blockTime: string;
  blockConfirmations: number;
  transactionDirection: 'self' | 'outcome' | 'income';
  addressFrom: string;
  addressFromBasic: string;
  addressTo: string;
  addressToBasic: string;
  addressAmount: string;
  transactionStatus: string;
  inputValue: string;
  transactionJson: {
    nonce: string;
    gas: string;
    gasPrice: string;
    transactionIndex: string;
  };
  transactionFee: string;
}

export default class OneScannerProcessor {
  private _blocksToConfirm = 10;
  private _settings: any; // Replace 'any' with the actual type of settings

  constructor(settings: any) {
    this._settings = settings;
  }

  /**
   * @param {string} address
   * @param {*} additionalData
   * @param {string} walletHash
   * @return {Promise<{balance:*, unconfirmed:*, provider:string}>}
   */
  async getBalanceBlockchain(
    address: string,
    additionalData: any,
    walletHash: string
  ): Promise<{ balance: any; unconfirmed: any; provider: string }> {
    const oneAddress = OneUtils.toOneAddress(address);
    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' OneScannerProcessor.getBalanceBlockchain started ' +
        address +
        ' ' +
        oneAddress
    );
    try {
      const apiPath = BlocksoftExternalSettings.getStatic('ONE_SERVER');
      const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'hmy_getBalance',
        params: [oneAddress, 'latest']
      };
      const res = await BlocksoftAxios._request(apiPath, 'POST', data);
      if (typeof res.data === 'undefined') {
        return false;
      }
      if (typeof res.data.error !== 'undefined') {
        throw new Error(JSON.stringify(res.data.error));
      }
      if (typeof res.data.result === 'undefined') {
        return false;
      }
      const balance = BlocksoftUtils.hexToDecimalBigger(res.data.result);
      return {
        provider: '',
        balance,
        unconfirmed: 0
      };
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode +
            ' OneScannerProcessor.getBalanceBlockchain address ' +
            address +
            ' ' +
            oneAddress +
            ' error ' +
            e.message
        );
      }
      BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' OneScannerProcessor.getBalanceBlockchain address ' +
          address +
          ' ' +
          oneAddress +
          ' error ' +
          e.message
      );
      return false;
    }
  }

  /**
   * @param {string} scanData.account.address
   * @param {string} scanData.account.walletHash
   * @return {Promise<[UnifiedTransaction]>}
   */
  async getTransactionsBlockchain(scanData: {
    account: { address: string; walletHash: string };
  }): Promise<UnifiedTransaction[]> {
    const { address } = scanData.account;
    const oneAddress = OneUtils.toOneAddress(address);
    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' OneScannerProcessor.getTransactionsBlockchain started ' +
        address +
        ' ' +
        oneAddress
    );
    try {
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
        typeof res.data === 'undefined' ||
        typeof res.data.result === 'undefined' ||
        typeof res.data.result.transactions === 'undefined'
      ) {
        return false;
      }
      const transactions: UnifiedTransaction[] = [];
      for (const tx of res.data.result.transactions) {
        const transaction = await this._unifyTransaction(
          address,
          oneAddress,
          tx
        );
        if (transaction) {
          transactions.push(transaction);
        }
      }
      return transactions;
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode +
            ' OneScannerProcessor.getTransactionsBlockchain address ' +
            address +
            ' error ' +
            e.message
        );
      }
      BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' OneScannerProcessor.getTransactionsBlockchain address ' +
          address +
          ' error ' +
          e.message
      );
      return false;
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
  private async _unifyTransaction(
    address: string,
    oneAddress: string,
    transaction: {
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
  ): Promise<UnifiedTransaction> {
    let formattedTime = transaction.timestamp;
    try {
      formattedTime = BlocksoftUtils.toDate(transaction.timestamp);
    } catch (e: any) {
      e.message +=
        ' timestamp error transaction data ' + JSON.stringify(transaction);
      throw e;
    }

    const confirmations =
      (new Date().getTime() - Number(transaction.timestamp)) / 60;
    const addressAmount = transaction.value;

    let transactionStatus = 'confirming';
    if (confirmations > 2) {
      transactionStatus = 'success';
    }

    const isOutcome =
      address.toLowerCase() === transaction.from.toLowerCase() ||
      oneAddress.toLowerCase() === transaction.from.toLowerCase();
    const isIncome =
      address.toLowerCase() === transaction.to.toLowerCase() ||
      oneAddress.toLowerCase() === transaction.to.toLowerCase();
    const tx: UnifiedTransaction = {
      transactionHash: transaction.ethHash.toLowerCase(),
      blockHash: transaction.blockHash,
      blockNumber: +transaction.blockNumber,
      blockTime: formattedTime,
      blockConfirmations: confirmations,
      transactionDirection: isOutcome
        ? isIncome
          ? 'self'
          : 'outcome'
        : 'income',
      addressFrom: isOutcome ? '' : transaction.from,
      addressFromBasic: transaction.from.toLowerCase(),
      addressTo: isIncome ? '' : transaction.to,
      addressToBasic: transaction.to,
      addressAmount,
      transactionStatus,
      inputValue: transaction.input,
      transactionJson: {
        nonce: transaction.nonce,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        transactionIndex: transaction.shardID // Change 'shardID' to the actual transaction index property name
      },
      transactionFee: BlocksoftUtils.mul(
        transaction.gasUsed,
        transaction.gasPrice
      ).toString()
    };

    return tx;
  }
}
