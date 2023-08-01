/**
 * @version 0.5
 */
import BlocksoftCryptoLog from '../../../common/BlocksoftCryptoLog';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BlocksoftUtils from '../../../common/BlocksoftUtils';
import TrxNodeInfoProvider from './TrxNodeInfoProvider';
import TransactionFilterTypeDict from '@appV2/dicts/transactionFilterTypeDict';

const TXS_MAX_TRY = 10;

interface CachedTransactionData {
  time: number;
  [tokenName: string]: UnifiedTransaction[] | number;
}

interface UnifiedTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  blockTime: number | Date;
  blockConfirmations: number;
  transactionDirection: string;
  addressFrom: string;
  addressTo: string;
  addressAmount: number;
  transactionStatus: string;
  transactionFee: number;
  transactionFilterType: string;
  inputValue: string;
}

export default class TrxTransactionsProvider {
  private _lastBlock = 15850641;
  private _tronscanLink =
    'https://api.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=50&address=';

  constructor() {
    this._nodeInfo = new TrxNodeInfoProvider();
  }

  private _nodeInfo: TrxNodeInfoProvider;

  async get(
    scanData: { account: { address: string } },
    tokenName: string
  ): Promise<false | UnifiedTransaction[]> {
    const address = scanData.account.address.trim();
    const now = new Date().getTime();

    if (
      typeof CACHE_OF_TRANSACTIONS[address] !== 'undefined' &&
      now - CACHE_OF_TRANSACTIONS[address].time < CACHE_VALID_TIME
    ) {
      if (typeof CACHE_OF_TRANSACTIONS[address][tokenName] !== 'undefined') {
        BlocksoftCryptoLog.log(
          ` TrxTransactionsProvider.get from cache',
          ${address} + ' => ' + ${tokenName}`
        );
        return CACHE_OF_TRANSACTIONS[address][tokenName];
      }
    }

    const res = await BlocksoftAxios.getWithoutBraking(
      this._tronscanLink + address,
      TXS_MAX_TRY
    );

    if (
      !res ||
      !res.data ||
      typeof res.data.data === 'undefined' ||
      res.data.data.length === 0
    )
      return false;

    this._lastBlock = await this._nodeInfo.getLastBlock();

    CACHE_OF_TRANSACTIONS[address] = {} as CachedTransactionData;
    CACHE_OF_TRANSACTIONS[address].time = new Date().getTime();
    CACHE_OF_TRANSACTIONS[address][tokenName] = [];
    let tx;
    for (tx of res.data.data) {
      let tmp = false;
      try {
        tmp = await this._unifyTransaction(scanData, tx, tokenName);
      } catch (e: any) {
        BlocksoftCryptoLog.log(
          'TrxTransactionsProvider.get unify error ' +
            e.message +
            ' tx ' +
            tx?.transactionHash
        );
      }
      if (!tmp) continue;

      const transaction = tmp?.res;

      let txTokenName = '_';
      if (typeof tmp.txTokenName !== 'undefined' && tmp.txTokenName) {
        txTokenName = tmp.txTokenName;
      } else if (typeof tx.contractData === 'undefined') {
        txTokenName = tokenName;
      } else if (typeof tx.contractData.contract_address !== 'undefined') {
        txTokenName = tx.contractData.contract_address;
      } else if (typeof tx.contractData.asset_name !== 'undefined') {
        txTokenName = tx.contractData.asset_name;
      }
      if (typeof CACHE_OF_TRANSACTIONS[address][txTokenName] === 'undefined') {
        CACHE_OF_TRANSACTIONS[address][txTokenName] = [];
      }
      CACHE_OF_TRANSACTIONS[address][txTokenName].push(transaction);
    }
    return CACHE_OF_TRANSACTIONS[address][tokenName];
  }

  private async _unifyTransaction(
    scanData: { account: { address: string } },
    transaction: {
      diffSeconds: number;
      amount: string;
      ownerAddress: string;
      data: string;
      contractData: {
        amount: string;
        contract_address?: string;
        asset_name?: string;
        frozen_balance?: string;
      };
      toAddress: string;
      block: string;
      confirmed: boolean;
      contractRet: string;
      hash: string;
      timestamp: string;
    },
    tokenName: string
  ): Promise<{ res: UnifiedTransaction; txTokenName: string } | false> {
    const address = scanData.account.address.trim();
    let transactionStatus = 'new';
    const now = new Date().getTime();
    transaction.diffSeconds = Math.round(
      // tslint:disable-next-line:radix
      (now - parseInt(transaction.timestamp)) / 1000
    );
    if (transaction.confirmed) {
      if (typeof transaction.contractRet === 'undefined') {
        transactionStatus = 'success';
      } else if (transaction.contractRet === 'SUCCESS') {
        transactionStatus = 'success';
      } else {
        transactionStatus = 'fail';
      }
      // tslint:disable-next-line:radix
    } else if (parseInt(transaction.block) > 0) {
      if (transaction.diffSeconds > 120) {
        transactionStatus = 'fail';
      } else {
        transactionStatus = 'confirming';
      }
    }
    // tslint:disable-next-line:radix
    if (parseInt(transaction.block) > this._lastBlock) {
      // tslint:disable-next-line:radix
      this._lastBlock = parseInt(transaction.block);
    }

    // tslint:disable-next-line:radix
    let blockConfirmations = this._lastBlock - parseInt(transaction.block);
    if (blockConfirmations > 100 && transaction.diffSeconds < 600) {
      blockConfirmations = transaction.diffSeconds;
    }

    if (typeof transaction.timestamp === 'undefined') {
      throw new Error(
        ' no transaction.timeStamp error transaction data ' +
          JSON.stringify(transaction)
      );
    }
    // tslint:disable-next-line:radix
    let formattedTime = parseInt(transaction.timestamp);
    try {
      formattedTime = BlocksoftUtils.toDate(
        // tslint:disable-next-line:radix
        parseInt(transaction.timestamp) / 1000
      );
    } catch (e: any) {
      e.message +=
        ' timestamp error transaction data ' + JSON.stringify(transaction);
      throw e;
    }
    let addressAmount = 0;
    let transactionDirection = 'self';
    const txTokenName = false;
    let addressFrom =
      address.toLowerCase() === transaction.ownerAddress.toLowerCase()
        ? ''
        : transaction.ownerAddress;
    let transactionFilterType = TransactionFilterTypeDict.USUAL;
    if (typeof transaction.contractData.amount === 'undefined') {
      if (
        typeof transaction.contractData !== 'undefined' &&
        typeof transaction.contractData.frozen_balance !== 'undefined'
      ) {
        // tslint:disable-next-line:radix
        addressAmount = parseInt(transaction.contractData.frozen_balance);
        transactionDirection = 'freeze';
        transactionFilterType = TransactionFilterTypeDict.STAKE;
      } else if (
        typeof transaction.amount !== 'undefined' &&
        typeof transaction.contractType !== 'undefined' &&
        // tslint:disable-next-line:radix
        parseInt(transaction.contractType) === 13
      ) {
        // tslint:disable-next-line:radix
        addressAmount = parseInt(transaction.amount);
        transactionDirection = 'claim';
        transactionFilterType = TransactionFilterTypeDict.STAKE;
      } else if (
        typeof transaction.contractType !== 'undefined' &&
        // tslint:disable-next-line:radix
        parseInt(transaction.contractType) === 12
      ) {
        // tslint:disable-next-line:radix
        addressAmount = parseInt(transaction.amount);
        addressFrom = transaction.ownerAddress;
        transactionDirection = 'unfreeze';
        transactionFilterType = TransactionFilterTypeDict.STAKE;
      } else if (
        typeof transaction.contractType !== 'undefined' &&
        // tslint:disable-next-line:radix
        parseInt(transaction.contractType) === 4
      ) {
        // no vote tx
        return false;
      } else {
        if (
          // tslint:disable-next-line:radix
          parseInt(transaction.contractType) === 11 ||
          // tslint:disable-next-line:radix
          parseInt(transaction.contractType) === 4 ||
          // tslint:disable-next-line:radix
          parseInt(transaction.contractType) === 13
        ) {
          // freeze = 11, vote = 4, claim = 13
        } else {
          // noinspection ES6MissingAwait
          BlocksoftCryptoLog.log(
            'TrxTransactionsProvider._unifyTransaction buggy tx ' +
              JSON.stringify(transaction)
          );
        }
        return false;
      }
    } else {
      // tslint:disable-next-line:radix
      addressAmount = parseInt(transaction.contractData.amount);
      transactionDirection =
        address.toLowerCase() === transaction.ownerAddress.toLowerCase()
          ? 'outcome'
          : 'income';
    }
    let transactionFee = 0;
    if (
      typeof transaction.cost !== 'undefined' &&
      typeof transaction.cost.fee !== 'undefined' &&
      transaction.cost.fee
    ) {
      transactionFee = parseFloat(transaction.cost.fee);
    }
    const res: UnifiedTransaction = {
      transactionHash: transaction.hash,
      blockHash: '',
      // tslint:disable-next-line:radix
      blockNumber: parseInt(transaction.block),
      blockTime: formattedTime,
      blockConfirmations: blockConfirmations,
      transactionDirection,
      addressFrom,
      addressTo:
        address.toLowerCase() === transaction.toAddress.toLowerCase()
          ? ''
          : transaction.toAddress,
      addressAmount,
      transactionStatus,
      transactionFee,
      transactionFilterType,
      inputValue: transaction.data
    };
    if (
      !res.addressTo &&
      (!res.addressFrom ||
        res.addressFrom.toLowerCase() === address.toLowerCase())
    ) {
      return false;
    }

    return { res, txTokenName };
  }
}

const CACHE_OF_TRANSACTIONS: { [address: string]: CachedTransactionData } = {};
const CACHE_VALID_TIME = 30000; // 30 seconds
