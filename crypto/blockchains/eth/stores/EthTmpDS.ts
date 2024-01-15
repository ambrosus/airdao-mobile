/* eslint-disable camelcase */
import {
  Database,
  TransactionScannersTmpDBModel,
  TransactionsDBModel
} from '@database';
import AirDaoBN from '../../../common/AirDAOBN';
import { DatabaseTable } from '@appTypes';

const tableName = DatabaseTable.TransactionScannersTmp;

const CACHE_TMP: { [key: string]: any } = {}; // TODO fix any

class EthTmpDS {
  async setSuccess(txHash: string) {
    await Database.unsafeRawQuery(
      DatabaseTable.Transactions,
      `UPDATE ${DatabaseTable.Transactions} SET transaction_status = 'success' WHERE transaction_hash='${txHash}'`
    );
  }

  async getCache(
    mainCurrencyCode: string,
    scanAddress: string,
    toRemove = false
  ) {
    const address = scanAddress.toLowerCase();
    const res = (await Database.unsafeRawQuery(
      tableName,
      `
                SELECT id, tmp_key AS tmpKey, tmp_sub_key AS tmpSubKey, tmp_val AS tmpVal, created_at AS createdAt
                FROM ${tableName}
                WHERE currency_code='${mainCurrencyCode}'
                AND address='${address}'
                AND tmp_key='nonces'
                `
    )) as TransactionScannersTmpDBModel[];
    CACHE_TMP[address] = {};
    let maxValue = -1;
    let maxScanned = -1;
    let maxSuccess = -1;
    const forBalances = {};

    if (res) {
      for (const row of res) {
        const val = row.tmpVal * 1;
        if (row.tmpSubKey === 'maxScanned') {
          if (val > maxScanned) {
            maxScanned = val;
          }
        } else if (row.tmpSubKey === 'maxSuccess') {
          if (val > maxSuccess) {
            maxSuccess = val;
          }
        } else {
          if (val > maxValue) {
            maxValue = val;
          }
        }
        CACHE_TMP[address][row.tmpSubKey] = val;
      }
      for (const row of res) {
        const val = row.tmpVal * 1;
        if (
          row.tmpSubKey === 'maxScanned' ||
          row.tmpSubKey === 'maxSuccess' ||
          !row.tmpSubKey ||
          typeof row.tmpSubKey === 'undefined'
        ) {
          // do nothing
        } else {
          const tmp = row.tmpSubKey.split('_');
          if (typeof tmp[1] !== 'undefined') {
            const txHash = tmp[1];
            if (toRemove && typeof toRemove[txHash] !== 'undefined') {
              Database.deleteModel(tableName, row.id);
            } else {
              if (val > maxSuccess) {
                forBalances[txHash] = val;
              }
            }
          }
        }
      }
    }

    const amountBN = {};
    let queryLength = 0;
    const queryTxs = [];
    for (const txHash in forBalances) {
      const tmps = (await Database.unsafeRawQuery(
        DatabaseTable.Transactions,
        `SELECT currency_code AS currencyCode,
                        address_amount as addressAmount,
                        transaction_status as transactionStatus
                        FROM transactions
                        WHERE transaction_hash='${txHash}'
                        AND (currency_code LIKE '%ETH%' OR currency_code LIKE 'CUSTOM_%')
                        `
      )) as TransactionsDBModel[];
      if (tmps && tmps && typeof tmps[0] !== 'undefined') {
        let txCurrencyCode = '';
        for (const tmp of tmps) {
          if (
            tmp.currencyCode === 'ETH' ||
            tmp.currencyCode === 'ETH_ROPSTEN'
          ) {
            if (txCurrencyCode === '') {
              txCurrencyCode = tmp.currencyCode;
            }
          } else {
            txCurrencyCode = tmp.currencyCode;
          }
        }
        if (txCurrencyCode !== '') {
          for (const tmp of tmps) {
            if (tmp.currencyCode !== txCurrencyCode) continue;

            let recheckRBFStatus = 'none';
            if (
              tmp.transactionStatus === 'new' ||
              tmp.transactionStatus === 'confirming'
            ) {
              const recheckTmp = (await Database.unsafeRawQuery(
                DatabaseTable.Transactions,
                `SELECT transaction_status as transactionStatus FROM transactions WHERE transactions_other_hashes LIKE '%${txHash}%'`
              )) as TransactionsDBModel[];
              if (
                recheckTmp &&
                recheckTmp &&
                typeof recheckTmp[0] !== 'undefined'
              ) {
                recheckRBFStatus = recheckTmp[0].transactionStatus;
                if (recheckRBFStatus !== 'new') {
                  await Database.unsafeRawQuery(
                    DatabaseTable.Transactions,
                    `UPDATE transactions SET transaction_status='${recheckRBFStatus}'
                                            WHERE transaction_hash='${txHash}'
                                            AND (currency_code LIKE '%ETH%' OR currency_code LIKE 'CUSTOM_%')
                                            `
                  );
                }
                tmp.transactionStatus = recheckRBFStatus;
              }
            }
            if (tmp.transactionStatus === 'new') {
              const amount = tmp.addressAmount;
              if (typeof amountBN[tmp.currencyCode] === 'undefined') {
                amountBN[tmp.currencyCode] = new AirDaoBN(0);
              }
              queryLength++;
              queryTxs.push({
                currencyCode: tmp.currencyCode,
                txHash,
                recheckRBFStatus
              });
              amountBN[tmp.currencyCode].add(amount);
            } else if (tmp.transactionStatus === 'missing') {
              if (maxSuccess > forBalances[txHash]) {
                maxSuccess = forBalances[txHash] - 1;
              }
            }
          }
        }
      }
    }
    CACHE_TMP[address].maxValue = maxValue;
    CACHE_TMP[address].maxScanned = maxScanned;
    CACHE_TMP[address].maxSuccess =
      maxSuccess > maxScanned ? maxSuccess : maxScanned;
    CACHE_TMP[address].amountBlocked = {};
    CACHE_TMP[address].queryLength = queryLength;
    CACHE_TMP[address].queryTxs = queryTxs;
    for (const key in amountBN) {
      // @ts-ignore
      CACHE_TMP[address].amountBlocked[key] = amountBN[key].toString();
    }
    return CACHE_TMP[address];
  }

  async getMaxNonce(mainCurrencyCode: string, scanAddress: string) {
    if (mainCurrencyCode !== 'ETH') {
      return false;
    }
    const address = scanAddress.toLowerCase();
    // if (typeof CACHE_TMP[address] === 'undefined' || typeof CACHE_TMP[address]['maxValue'] === 'undefined') {
    await this.getCache(mainCurrencyCode, address);
    // }
    return {
      maxValue: CACHE_TMP[address].maxValue,
      maxScanned: CACHE_TMP[address].maxScanned,
      maxSuccess: CACHE_TMP[address].maxSuccess,
      amountBlocked: CACHE_TMP[address].amountBlocked,
      queryLength: CACHE_TMP[address].queryLength,
      queryTxs: CACHE_TMP[address].queryTxs
    };
  }

  async removeNonce(
    mainCurrencyCode: string,
    scanAddress: string,
    key: string
  ) {
    if (mainCurrencyCode !== 'ETH') {
      return false;
    }
    const address = scanAddress.toLowerCase();
    const where = `WHERE currency_code='${mainCurrencyCode}' AND address='${address}' AND tmp_key='nonces' AND tmp_sub_key='${key}'`;
    await Database.unsafeRawQuery(
      tableName,
      `DELETE FROM ${tableName} ${where}`
    );
    await this.getCache(mainCurrencyCode, address);
  }

  async saveNonce(
    mainCurrencyCode: string | undefined,
    scanAddress: string,
    key: string,
    value: number
  ) {
    if (mainCurrencyCode !== 'ETH') {
      return false;
    }
    const address = scanAddress.toLowerCase();
    const now = new Date().toISOString();
    value = value * 1;

    const where = `WHERE currency_code='${mainCurrencyCode}' AND address='${address}' AND tmp_key='nonces' AND tmp_sub_key='${key}'`;
    const res = (await Database.unsafeRawQuery(
      tableName,
      `SELECT tmp_val AS tmpVal FROM ${tableName} ${where}`
    )) as TransactionScannersTmpDBModel[];
    if (res && res && res.length > 0) {
      // @ts-ignore
      if (res[0].tmpVal * 1 >= value) {
        return true;
      }
      await Database.unsafeRawQuery(
        tableName,
        `DELETE FROM ${tableName} ${where}`
      );
    }

    const prepared = [
      {
        currency_code: mainCurrencyCode,
        address: address.toLowerCase(),
        tmp_key: 'nonces',
        tmp_sub_key: key,
        tmp_val: value,
        created_at: now
      }
    ];
    await Database.createModel(tableName, prepared);
    await this.getCache(mainCurrencyCode, address);
  }
}

export default new EthTmpDS();
