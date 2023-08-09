/**
 * @version 0.5
 * https://github.com/tronscan/tronscan-frontend/wiki/TRONSCAN-API
 */
import TrxTransactionsProvider from './TrxTransactionsProvider';
import BlocksoftUtils from '../../../common/AirDAOUtils';
import AirDAOAxios from '@crypto/common/AirDAOAxios';
import { Database, TransactionsDBModel } from '@database';
import { DatabaseTable } from '@appTypes';
import TransactionFilterTypeDict from '@crypto/TransactionFilterTypeDict';
import SWAPS from '../dict/swaps';

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: string;
  blockTime: Date;
  blockConfirmations: number;
  transactionDirection:
    | 'income'
    | 'outcome'
    | 'self'
    | 'swap_income'
    | 'swap_outcome';
  addressFrom: string;
  addressTo: string;
  addressAmount: string;
  transactionStatus: 'new' | 'success' | 'fail';
  transactionFee: number;
  inputValue: string;
}

export default class TrxTransactionsTrc20Provider extends TrxTransactionsProvider {
  protected _token: string | false = false;
  protected _tronscanLink = '';

  setLink(token: string) {
    this._token = token;
    this._tronscanLink =
      'https://apilist.tronscan.org/api/contract/events?sort=-timestamp&count=true&limit=50&contract=' +
      token +
      '&address=';
  }

  async _unifyTransaction(
    scanData: { account: { address: string; transactionsScanTime: number } },
    transaction: {
      amount?: string;
      transferFromAddress?: string;
      data?: string;
      decimals?: string;
      tokenName?: string;
      transferToAddress?: string;
      block?: string;
      id?: string;
      confirmed?: boolean;
      transactionHash?: string;
      timestamp?: number;
    }
  ): Promise<UnifiedTransaction | false> {
    const address = scanData.account.address.trim();
    let transactionStatus: 'new' | 'success' | 'fail' = 'new';
    if (transaction.confirmed) {
      transactionStatus = 'success';
    } else if (transaction.block && parseInt(transaction.block) > 0) {
      transactionStatus = 'fail';
    }

    const txTokenName: string | false = false;
    let formattedTime: Date;
    try {
      formattedTime = BlocksoftUtils.toDate(
        transaction.timestamp ? transaction.timestamp / 1000 : 0
      );
    } catch (e: any) {
      e.message +=
        ' timestamp error transaction data ' + JSON.stringify(transaction);
      throw e;
    }
    // if (typeof transaction.amount === 'undefined') {
    //   // noinspection ES6MissingAwait
    //   AirDAOCryptoLog.err(
    //     'TrxTransactionsTrc20Provider._unifyTransaction buggy tx ' +
    //       JSON.stringify(transaction)
    //   );
    // }

    const res: UnifiedTransaction = {
      transactionHash: transaction.transactionHash || '',
      blockHash: '',
      blockNumber: transaction.block || '0',
      blockTime: formattedTime,
      blockConfirmations: this._lastBlock
        ? this._lastBlock - parseInt(transaction.block || '0', 20)
        : 0,
      transactionDirection:
        address.toLowerCase() ===
        (transaction.transferFromAddress || '').toLowerCase()
          ? 'outcome'
          : 'income',
      addressFrom:
        address.toLowerCase() ===
        (transaction.transferFromAddress || '').toLowerCase()
          ? ''
          : transaction.transferFromAddress || '',
      addressTo:
        address.toLowerCase() ===
        (transaction.transferToAddress || '').toLowerCase()
          ? ''
          : transaction.transferToAddress || '',
      addressAmount:
        typeof transaction.amount !== 'undefined'
          ? transaction.amount.toString()
          : '0',
      transactionStatus,
      transactionFee: 0,
      inputValue: transaction.data || ''
    };

    let needData = false;
    if (
      res.addressAmount.indexOf(
        '115792089237316195423570985008687907853269984665640564039457'
      ) === 0
    ) {
      res.addressAmount = '0';
      needData = true;
    }
    if (SWAPS[res.addressTo] !== undefined) {
      res.addressTo = SWAPS[res.addressTo];
      res.transactionDirection = 'swap_outcome';
      res.addressAmount = '0';
      needData = true;
    } else if (SWAPS[res.addressFrom] !== undefined) {
      res.addressFrom = SWAPS[res.addressFrom];
      res.transactionDirection = 'swap_income';
      res.addressAmount = '0';
      needData = true;
    } else if (res.transactionDirection === 'outcome') {
      needData = true;
    }

    if (needData) {
      const diff =
        scanData.account.transactionsScanTime -
        (transaction.timestamp || 0) / 1000;
      if (diff > 6000) {
        return false;
      }
    }

    if (needData) {
      const tmp = await AirDAOAxios.get(
        'https://apilist.tronscan.org/api/transaction-info?hash=' +
          res.transactionHash
      );
      res.transactionFee =
        tmp.data.cost.fee * 1 + tmp.data.cost.energy_fee * 1 || 0;

      if (res.transactionFee > 0 && res.addressAmount * 1 > 0) {
        const savedTRX = (await Database.unsafeRawQuery(
          DatabaseTable.Transactions,
          ` SELECT * FROM ${DatabaseTable.Transactions} WHERE transaction_hash='${res.transactionHash}' AND currency_code='TRX' `
        )) as TransactionsDBModel[];
        if (!savedTRX || savedTRX.length === 0) {
          // AirDAOCryptoLog.log(
          //   'TrxTransactionsTrc20Provider._unifyTransaction added fee for ' +
          //     res.transactionHash +
          //     ' amount ' +
          //     res.addressAmount +
          //     ' fee ' +
          //     res.transactionFee
          // );
          const saveFee: UnifiedTransaction = {
            account_id: 0,
            address_amount: 0,
            address_from: res.addressFrom,
            address_to: res.addressTo,
            block_confirmations: res.blockConfirmations,
            block_number: res.blockNumber,
            block_time: res.blockTime,
            created_at: res.blockTime,
            currency_code: 'TRX',
            mined_at: res.blockTime,
            transaction_direction: res.transactionDirection,
            transaction_fee: res.transactionFee,
            transaction_filter_type: TransactionFilterTypeDict.FEE,
            transaction_hash: res.transactionHash,
            transaction_status: res.transactionStatus,
            transactions_scan_time: new Date().getTime(),
            wallet_hash: scanData.account.walletHash
          };
          await Database.createModel(DatabaseTable.Transactions, saveFee);
        }
      }
      if (tmp.data.trc20TransferInfo !== undefined) {
        for (const info of tmp.data.trc20TransferInfo) {
          if (info.contract_address !== this._token) continue;
          if (info.from_address === address) {
            if (info.to_address === address) {
              res.transactionDirection = 'self';
            } else {
              res.transactionDirection = 'outcome';
            }
          } else if (info.to_address === address) {
            res.transactionDirection = 'income';
            res.addressAmount = info.amount_str || '0';
          }
        }
      }
      if (res.transactionFee === 0 || res.addressAmount * 1 === 0) {
        return false;
      }
    } else if (res.addressAmount * 1 === 0) {
      return false;
    }

    return { res, txTokenName };
  }
}
