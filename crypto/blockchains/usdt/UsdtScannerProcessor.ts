/**
 * @version 0.5
 */
import BlocksoftUtils from '../../common/AirDAOUtils';
import AirDAOAxios from '../../common/AirDAOAxios';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import AirDAODispatcher from '../AirDAODispatcher';

const USDT_API = 'https://microscanners.trustee.deals/usdt'; // https://microscanners.trustee.deals/usdt/1CmAoxq8BTxANRDwheJUpaGy6ngWNYX85
const USDT_API_MASS = 'https://microscanners.trustee.deals/balanceMass';

const CACHE_VALID_TIME = 30000; // 30 seconds
const CACHE: {
  [address: string]: { data: any; time: number; provider: string };
} = {};

export default class UsdtScannerProcessor {
  /**
   * @type {number}
   */
  lastBlock = 0;

  /**
   * @type {number}
   * @private
   */
  private _blocksToConfirm = 1;

  /**
   * @type {boolean|BtcScannerProcessor}
   * @private
   */
  private _btcProvider: boolean | BtcScannerProcessor = false;

  /**
   * @param address
   * @returns {Promise<boolean|*>}
   * @private
   */
  private async _get(address: string): Promise<boolean | any> {
    const now = new Date().getTime();
    if (
      typeof CACHE[address] !== 'undefined' &&
      now - CACHE[address].time < CACHE_VALID_TIME
    ) {
      CACHE[address].provider = 'usdt-cache';
      return CACHE[address];
    }
    const link = `${USDT_API}/${address}`;
    const res = await AirDAOAxios.getWithoutBraking(link);
    if (!res || typeof res.data === 'undefined' || !res.data) {
      return false;
    }
    if (typeof res.data.status === 'undefined') {
      throw new Error(
        'UsdtScannerProcessor._get bad status loaded for address ' + link
      );
    }
    if (
      typeof res.data.data === 'undefined' ||
      typeof res.data.data.balance === 'undefined'
    ) {
      throw new Error(
        'UsdtScannerProcessor._get nothing loaded for address ' + link
      );
    }
    if (typeof CACHE[address] !== 'undefined') {
      if (CACHE[address].data.block > res.data.data.block) {
        return false;
      }
    }
    CACHE[address] = {
      data: res.data.data,
      time: now,
      provider: 'usdt'
    };
    return CACHE[address];
  }

  /**
   * @param address
   * @returns {Promise<boolean|*>}
   * @private
   */
  private async _getMass(address: string): Promise<boolean | any> {
    const now = new Date().getTime();

    // mass ask
    const link = `${USDT_API_MASS}`;
    const res = await AirDAOAxios.postWithoutBraking(link, address);

    if (!res || typeof res.data === 'undefined') {
      return false;
    }
    return {
      data: res.data.data,
      time: now,
      provider: 'usdt'
    };
  }

  /**
   * @param {string} address
   * @return {Promise<{int:balance, int:provider}>}
   */
  public async getBalanceBlockchain(address: string): Promise<
    | {
        balance: number;
        provider: string;
        time: number;
        unconfirmed: number;
        balanceScanBlock: number;
      }
    | false
  > {
    if (typeof address === 'object') {
      AirDAOCryptoLog.log(
        'UsdtScannerProcessor.getBalance started MASS ' +
          JSON.stringify(address)
      );
      return this._getMass(address);
    }

    AirDAOCryptoLog.log('UsdtScannerProcessor.getBalance started ' + address);
    const tmp = await this._get(address);
    if (typeof tmp === 'undefined' || !tmp || typeof tmp.data === 'undefined') {
      AirDAOCryptoLog.log('UsdtScannerProcessor.getBalance bad tmp ', tmp);
      return false;
    }
    if (
      !tmp.data ||
      typeof tmp.data.balance === 'undefined' ||
      tmp.data.balance === false
    ) {
      AirDAOCryptoLog.log(
        'UsdtScannerProcessor.getBalance bad tmp.data ',
        tmp.data
      );
      return false;
    }
    const balance: number = tmp.data.balance;
    AirDAOCryptoLog.log(
      `UsdtScannerProcessor.getBalance finished
      ${address + ' => ' + balance}`
    );
    return {
      balance,
      provider: tmp.provider,
      time: tmp.time,
      unconfirmed: 0,
      balanceScanBlock: tmp.data.block
    };
  }

  /**
   * @param {string} scanData.account.address
   * @return {Promise<UnifiedTransaction[]>}
   */
  public async getTransactionsBlockchain(
    scanData: { account: { address: string } },
    source = ''
  ): Promise<UnifiedTransaction[]> {
    const address = scanData.account.address.trim();
    AirDAOCryptoLog.log(
      'UsdtScannerProcessor.getTransactions started ' + address
    );
    let tmp = await this._get(address);
    if (!tmp || typeof tmp.data === 'undefined') {
      AirDAOCryptoLog.log('UsdtScannerProcessor.getTransactions bad tmp ', tmp);
      return [];
    }
    if (!tmp.data) {
      AirDAOCryptoLog.log(
        'UsdtScannerProcessor.getTransactions bad tmp.data ',
        tmp.data
      );
      return [];
    }

    tmp = tmp.data;
    if (typeof tmp.data !== 'undefined') {
      tmp = tmp.data; // wtf but ok to support old wallets
    }
    if (typeof tmp.txs === 'undefined') {
      throw new Error('Undefined txs ' + JSON.stringify(tmp));
    }

    const transactions: UnifiedTransaction[] = [];
    if (tmp.block > this.lastBlock) {
      this.lastBlock = tmp.block;
    }
    let tx;
    const unique: { [transactionHash: string]: number } = {};
    if (tmp.txs && tmp.txs.length > 0) {
      for (tx of tmp.txs) {
        const transaction = await this._unifyTransaction(address, tx);
        transactions.push(transaction);
        unique[transaction.transactionHash] = 1;
      }
    }
    let btcTxs: UnifiedTransaction[] | false = false;
    try {
      if (!this._btcProvider) {
        this._btcProvider = (await new AirDAODispatcher().getScannerProcessor({
          currencyCode: 'BTC'
        })) as BtcScannerProcessor;
      }
      btcTxs = await this._btcProvider.getTransactionsBlockchain(
        scanData,
        source + ' UsdtScannerProcessor'
      );
    } catch (e: any) {
      throw e;
    }
    if (btcTxs && btcTxs.length > 0) {
      for (tx of btcTxs) {
        if (typeof unique[tx.transactionHash] !== 'undefined') continue;
        transactions.push({
          addressAmount: tx.addressAmount,
          addressFrom: tx.addressFrom,
          addressTo: tx.addressTo,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          inputValue: tx.inputValue,
          transactionFee: tx.transactionFee,
          blockConfirmations: tx.blockConfirmations,
          blockTime: tx.blockTime,
          transactionDirection: tx.transactionDirection,
          transactionHash: tx.transactionHash,
          transactionStatus: tx.transactionStatus
        });
      }
    }
    AirDAOCryptoLog.log(
      'UsdtScannerProcessor.getTransactions finished ' +
        address +
        ' total: ' +
        transactions.length
    );
    return transactions;
  }

  /**
   *
   * @param {string} address
   * @param {Object} transaction
   * @param {string} transaction.block_number: 467352,
   * @param {string} transaction.transaction_block_hash: '0000000000000000018e86423804e917c75348090419a46e506bc2d4818c2827',
   * @param {string} transaction.transaction_hash: '7daaa478c829445c967d4607345227286a23acd20f5bc80709e418d0e286ecf1',
   * @param {string} transaction.transaction_txid: '7daaa478c829445c967d4607345227286a23acd20f5bc80709e418d0e286ecf1',
   * @param {string} transaction.from_address: '1GYmxyavRvjCMsmfDR2uZLMsCPoFNYw9zM',
   * @param {string} transaction.to_address: '1Po1oWkD2LmodfkBYiAktwh76vkF93LKnh',
   * @param {string} transaction.amount: 0.744019,
   * @param {string} transaction.fee: 0.0008,
   * @param {string} transaction.custom_type: '',
   * @param {string} transaction.custom_valid: '',
   * @param {string} transaction.created_time: '2017-05-20T22:28:15.000Z',
   * @param {string} transaction.updated_time: null,
   * @param {string} transaction.removed_time: null,
   * @param {string} transaction._removed: 0,
   * @return {UnifiedTransaction}
   * @private
   */
  private async _unifyTransaction(
    address: string,
    transaction: any
  ): Promise<UnifiedTransaction> {
    const confirmations: number = this.lastBlock - transaction.block_number;
    let transactionStatus: 'new' | 'success' | 'confirming' = 'new';
    if (confirmations >= this._blocksToConfirm) {
      transactionStatus = 'success';
    } else if (confirmations > 0) {
      transactionStatus = 'confirming';
    }
    const tx: UnifiedTransaction = {
      transactionHash: transaction.transaction_txid,
      blockHash: transaction.transaction_block_hash,
      blockNumber: +transaction.block_number,
      blockTime: transaction.created_time,
      blockConfirmations: confirmations,
      transactionDirection:
        address.toLowerCase() === transaction.from_address.toLowerCase()
          ? 'outcome'
          : 'income',
      addressFrom:
        transaction.from_address === address ? '' : transaction.from_address,
      addressTo:
        transaction.to_address === address ? '' : transaction.to_address,
      addressAmount: transaction.amount,
      transactionStatus:
        transaction.custom_valid.toString() === '1' &&
        transaction._removed.toString() === '0'
          ? transactionStatus
          : 'fail',
      transactionFee: BlocksoftUtils.toSatoshi(transaction.fee),
      inputValue: transaction.custom_type
    };
    if (tx.addressTo === '' && tx.addressFrom === '') {
      tx.transactionDirection = 'self';
      tx.addressAmount = 0;
    }
    return tx;
  }
}

type UnifiedTransaction = {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  blockTime: string;
  blockConfirmations: number;
  transactionDirection: 'income' | 'outcome' | 'self';
  addressFrom: string;
  addressTo: string;
  addressAmount: string;
  transactionStatus: 'new' | 'success' | 'confirming' | 'fail';
  transactionFee: number;
  inputValue: string;
};

/**
 * BtcScannerProcessor interface for TypeScript
 */
interface BtcScannerProcessor {
  getTransactionsBlockchain(
    scanData: { account: { address: string } },
    source: string
  ): Promise<UnifiedTransaction[] | false>;
}