/**
 * @version 0.20
 */
import BlocksoftAxios from '../../common/BlocksoftAxios';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import BlocksoftUtils from '../../common/AirDAOUtils';
import config from '@constants/config';

const API_PATH = 'https://horizon.stellar.org';
const FEE_DECIMALS = 7;

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: string;
  blockTime: string;
  blockConfirmations: number;
  transactionDirection: string;
  addressFrom: string;
  addressTo: string;
  addressAmount: string;
  transactionStatus: string;
  transactionFee: string;
  transactionJson?: { memo: string };
}

export default class XlmScannerProcessor {
  /**
   * https://horizon.stellar.org/accounts/GBH4TZYZ4IRCPO44CBOLFUHULU2WGALXTAVESQA6432MBJMABBB4GIYI
   * @param {string} address
   * @return {Promise<{balance, unconfirmed, provider}>}
   */
  async getBalanceBlockchain(
    address: string
  ): Promise<
    { balance: number; unconfirmed: number; provider: string } | false
  > {
    const link = `${API_PATH}/accounts/${address}`;
    let res: any = false;
    let balance = 0;
    try {
      res = await BlocksoftAxios.getWithoutBraking(link);
      if (
        res &&
        typeof res.data !== 'undefined' &&
        res.data &&
        typeof res.data.balances !== 'undefined'
      ) {
        let row;
        for (row of res.data.balances) {
          if (row.asset_type === 'native') {
            balance = row.balance;
            break;
          }
        }
      } else {
        return false;
      }
    } catch (e: any) {
      if (
        e.message.indexOf('timed out') === -1 &&
        e.message.indexOf('account not found') === -1 &&
        e.message.indexOf('the resource at the url requested was not found') ===
          -1
      ) {
        throw e;
      } else {
        return false;
      }
    }
    return {
      balance,
      unconfirmed: 0,
      provider: 'horizon.stellar.org'
    };
  }

  /**
   * https://horizon.stellar.org/accounts/GBH4TZYZ4IRCPO44CBOLFUHULU2WGALXTAVESQA6432MBJMABBB4GIYI/payments
   * @param {string} scanData.account.address
   * @return {Promise<UnifiedTransaction[]>}
   */
  async getTransactionsBlockchain(scanData: {
    account: { address: string };
  }): Promise<UnifiedTransaction[] | false> {
    const address = scanData.account.address.trim();
    AirDAOCryptoLog.log(
      'XlmScannerProcessor.getTransactions started ' + address
    );
    const linkTxs = `${API_PATH}/accounts/${address}/transactions?order=desc&limit=50`;
    let res: any = false;
    try {
      res = await BlocksoftAxios.getWithoutBraking(linkTxs);
    } catch (e: any) {
      if (
        e.message.indexOf('account not found') === -1 &&
        e.message.indexOf('to retrieve payments') === -1 &&
        e.message.indexOf('limit exceeded') === -1 &&
        e.message.indexOf('timed out') === -1 &&
        e.message.indexOf('resource missing') === -1
      ) {
        throw e;
      } else {
        return false;
      }
    }

    if (!res || typeof res.data === 'undefined' || !res.data) {
      return false;
    }
    if (
      typeof res.data._embedded === 'undefined' ||
      typeof res.data._embedded.records === 'undefined'
    ) {
      throw new Error(
        'Undefined basic txs ' + linkTxs + ' ' + JSON.stringify(res.data)
      );
    }
    if (typeof res.data._embedded.records === 'string') {
      throw new Error(
        'Undefined basic txs ' + linkTxs + ' ' + res.data._embedded.records
      );
    }
    const basicTxs: Record<string, any> = {};
    for (const row of res.data._embedded.records) {
      basicTxs[row.hash] = row;
    }

    const link = `${API_PATH}/accounts/${address}/payments?order=desc&limit=50`;
    res = false;
    try {
      res = await BlocksoftAxios.getWithoutBraking(link);
    } catch (e: any) {
      if (
        e.message.indexOf('account not found') === -1 &&
        e.message.indexOf('to retrieve payments') === -1 &&
        e.message.indexOf('limit exceeded') === -1 &&
        e.message.indexOf('timed out') === -1
      ) {
        throw e;
      } else {
        return false;
      }
    }

    if (!res || typeof res.data === 'undefined' || !res.data) {
      return false;
    }
    if (
      typeof res.data._embedded === 'undefined' ||
      typeof res.data._embedded.records === 'undefined'
    ) {
      throw new Error('Undefined txs ' + link + ' ' + JSON.stringify(res.data));
    }
    if (typeof res.data._embedded.records === 'string') {
      throw new Error(
        'Undefined txs ' + link + ' ' + res.data._embedded.records
      );
    }

    const transactions = await this._unifyTransactions(
      address,
      res.data._embedded.records,
      basicTxs
    );
    AirDAOCryptoLog.log(
      'XlmScannerProcessor.getTransactions finished ' + address
    );
    return transactions;
  }

  async _unifyTransactions(
    address: string,
    result: any[],
    basicTxs: Record<string, any>
  ): Promise<UnifiedTransaction[]> {
    const transactions: UnifiedTransaction[] = [];
    let tx;
    for (tx of result) {
      const transaction = await this._unifyPayment(
        address,
        tx,
        typeof basicTxs[tx.transaction_hash]
          ? basicTxs[tx.transaction_hash]
          : false
      );
      if (transaction) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  /**
   * @param {string} address
   * @param {Object} transaction
   * @param {string} transaction.amount "1.6387292"
   * @param {string} transaction.asset_type "native"
   * @param {string} transaction.created_at "2021-01-30T21:15:04Z"
   * @param {string} transaction.from "GDK45DNCNF66HZ634ZGYHVB3KGF3MUFJJ3CKWCI2QTKHRPQW22PBP5OE"
   * @param {string} transaction.id "145082573625237505"
   * @param {string} transaction.paging_token "145082573625237505"
   * @param {string} transaction.source_account "GDK45DNCNF66HZ634ZGYHVB3KGF3MUFJJ3CKWCI2QTKHRPQW22PBP5OE"
   * @param {string} transaction.to "GBH4TZYZ4IRCPO44CBOLFUHULU2WGALXTAVESQA6432MBJMABBB4GIYI"
   * @param {string} transaction.transaction_hash "d01d19b75638405a510db0ac0e937849548ee21ff411ebe376a30d25dc78b750"
   * @param {string} transaction.transaction_successful true
   * @param {string} transaction.type "payment"
   * @param {string} transaction.type_i 1
   * @return {UnifiedTransaction}
   * @private
   */
  async _unifyPayment(
    address: string,
    transaction: any,
    basicTransaction: any
  ): Promise<UnifiedTransaction | false> {
    try {
      if (typeof transaction.asset_type !== 'undefined') {
        if (transaction.asset_type !== 'native') {
          return false;
        }
      } else if (typeof transaction.type !== 'undefined') {
        if (transaction.type === 'create_account') {
          if (
            typeof transaction.amount === 'undefined' &&
            typeof transaction.starting_balance !== 'undefined'
          ) {
            transaction.amount = transaction.starting_balance;
          }
          if (
            typeof transaction.source_account === 'undefined' &&
            typeof transaction.funder !== 'undefined'
          ) {
            // eslint-disable-next-line camelcase
            transaction.source_account = transaction.funder;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
      const tx: UnifiedTransaction = {
        transactionHash: transaction.transaction_hash,
        blockHash: '',
        blockNumber: '',
        blockTime: transaction.created_at,
        blockConfirmations:
          transaction.transaction_successful === true ? 100 : 0,
        transactionDirection: '?',
        addressFrom:
          transaction.source_account === address
            ? ''
            : transaction.source_account,
        addressTo: transaction.account === address ? '' : transaction.account,
        addressAmount: transaction.amount,
        transactionStatus:
          transaction.transaction_successful === true ? 'success' : 'new',
        transactionFee: '0'
      };
      if (tx.addressTo === '' || !tx.addressTo) {
        if (tx.addressFrom === '') {
          tx.transactionDirection = 'self';
        } else {
          tx.transactionDirection = 'income';
        }
      } else {
        tx.transactionDirection = 'outcome';
      }

      if (basicTransaction) {
        if (typeof basicTransaction.fee_charged !== 'undefined') {
          tx.transactionFee = BlocksoftUtils.toUnified(
            basicTransaction.fee_charged,
            FEE_DECIMALS
          ).toString();
        }
        if (typeof basicTransaction.ledger !== 'undefined') {
          tx.blockHash = basicTransaction.ledger;
          tx.blockNumber = basicTransaction.ledger;
        }
        if (typeof basicTransaction.memo !== 'undefined') {
          tx.transactionJson = { memo: basicTransaction.memo };
        }
      }
      return tx;
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log('XLMScannerProcessor _unifyPayment error ' + e.message);
      }
      throw e;
    }
  }
}
