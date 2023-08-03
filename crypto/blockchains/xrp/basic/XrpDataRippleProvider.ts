import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import XrpTmpDS from '@crypto/blockchains/xrp/stores/XrpTmpDS';

const CACHE_VALID_TIME = 60000;
let CACHE_BLOCK_DATA: { [index: string]: { data: any; time: number } } = {};

const API_PATH = 'https://data.ripple.com/v2';
export default class XrpDataRippleProvider {
  setCache(tmp: { [index: string]: { data: any; time: number } }) {
    CACHE_BLOCK_DATA = tmp;
  }

  async getBalanceBlockchain(address: string) {
    const link = `${API_PATH}/accounts/${address}/balances`;
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
          if (row.currency === 'XRP') {
            balance = row.value;
            break;
          }
        }
      } else {
        return false;
      }
    } catch (e: any) {
      if (
        e.message.indexOf('timed out') === -1 &&
        e.message.indexOf('account not found') === -1
      ) {
        throw e;
      } else {
        return false;
      }
    }
    return { balance, unconfirmed: 0, provider: 'ripple.com' };
  }

  async getTransactionsBlockchain(scanData: {
    account: any;
    additional?: any;
  }) {
    const address = scanData.account.address.trim();
    const action = 'payments';
    await AirDAOCryptoLog.log(
      'XrpScannerProcessor.DataRipple.getTransactions ' +
        action +
        ' started ' +
        address
    );
    const link = `${API_PATH}/accounts/${address}/payments`;
    let res: any = false;
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
    if (typeof res.data[action] === 'undefined') {
      throw new Error('Undefined txs ' + link + ' ' + JSON.stringify(res.data));
    }
    if (typeof res.data[action] === 'string') {
      throw new Error('Undefined txs ' + link + ' ' + res.data[action]);
    }

    const transactions = await this._unifyTransactions(
      address,
      res.data[action],
      action
    );
    await AirDAOCryptoLog.log(
      'XrpScannerProcessor.DataRipple.getTransactions ' +
        action +
        ' finished ' +
        address
    );
    return transactions;
  }

  async _unifyTransactions(address: string, result: any, action: string) {
    const transactions = [];
    let tx;
    for (tx of result) {
      const transaction = await this._unifyPayment(address, tx);
      if (transaction) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  async _unifyPayment(address: string, transaction: any) {
    let direction;
    let amount;

    if (transaction.currency === 'XRP') {
      if (transaction.source_currency === 'XRP') {
        direction = address === transaction.source ? 'outcome' : 'income';
      } else if (transaction.destination === address) {
        direction = 'income'; // USDT any => XRP my
      } else {
        // USDT my => XRP not my
        return false; // do nothing
      }
    } else if (transaction.source_currency === 'XRP') {
      if (transaction.source === address) {
        direction = 'outcome'; // XRP my => USDT any
      } else {
        // XRP not my => USDT my
        return false; // do nothing
      }
    } else {
      return false; // USDT => USDT
    }

    if (direction === 'income') {
      amount = transaction.delivered_amount;
    } else {
      amount = transaction.amount;
    }

    let transactionStatus = 'new';
    let ledger = false;
    if (
      typeof transaction.ledger_index !== 'undefined' &&
      transaction.ledger_index > 0
    ) {
      ledger = await this._getLedger(transaction.ledger_index);
      if (ledger && ledger.transactionConfirmations > 5) {
        transactionStatus = 'success';
      }
    }

    if (typeof transaction.executed_time === 'undefined') {
      transaction.executed_time = '';
    }
    const tx = {
      transactionHash: transaction.tx_hash,
      blockHash: ledger ? ledger.ledger_hash : '',
      blockNumber: transaction.ledger_index,
      blockTime: transaction.executed_time,
      blockConfirmations: ledger ? ledger.transactionConfirmations : 0,
      transactionDirection: direction,
      addressFrom: transaction.source === address ? '' : transaction.source,
      addressTo:
        transaction.destination === address ? '' : transaction.destination,
      addressAmount: amount,
      transactionStatus: transactionStatus,
      transactionFee: transaction.transaction_cost
    };
    if (typeof transaction.destination_tag !== undefined) {
      tx.transactionJson = { memo: transaction.destination_tag };
    }
    return tx;
  }

  async _getLedger(index: string) {
    const now = new Date().getTime();
    await AirDAOCryptoLog.log(
      'XrpScannerProcessor.DataRipple._getLedger started ' + index
    );
    const link = `${API_PATH}/ledgers/${index}`;
    let res: any = false;
    if (
      typeof CACHE_BLOCK_DATA[index] === 'undefined' ||
      (now - CACHE_BLOCK_DATA[index].time > CACHE_VALID_TIME &&
        CACHE_BLOCK_DATA[index].data.transactionConfirmations < 100)
    ) {
      try {
        res = await BlocksoftAxios.getWithoutBraking(link);
        if (
          res.data &&
          typeof res.data !== 'undefined' &&
          typeof res.data.ledger !== 'undefined'
        ) {
          await AirDAOCryptoLog.log(
            'XrpScannerProcessor.DataRipple._getLedger updated for index ' +
              index +
              ' ' +
              JSON.stringify(res.data.ledger)
          );
          const ledger = {
            close_time: res.data.ledger.close_time,
            ledger_hash: res.data.ledger.ledger_hash,
            transactionConfirmations: Math.round(
              (now - res.data.ledger.close_time * 1000) / (60 * 1000)
            ) // minutes
          };
          CACHE_BLOCK_DATA[index] = {
            data: ledger,
            time: now
          };
        }
        await XrpTmpDS.saveCache(CACHE_BLOCK_DATA);
      } catch (e: any) {
        if (
          e.message.indexOf('timed out') === -1 &&
          e.message.indexOf('account not found') === -1
        ) {
          throw e;
        } else {
          res = false;
        }
      }
    }
    if (typeof CACHE_BLOCK_DATA[index] === 'undefined') {
      return false;
    }
    return CACHE_BLOCK_DATA[index].data;
  }
}
