/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Database, TransactionScannersTmpDBModel } from '@database';

const tableName = DatabaseTable.TransactionScannersTmp;

class OneTmpDS {
  /**
   * @type {string}
   * @private
   */
  _currencyCode = 'ONE';

  async getCache(address: string) {
    const res = (await Database.unsafeRawQuery(
      tableName,
      `
                SELECT tmp_key AS tmpKey, tmp_sub_key AS tmpSubKey, tmp_val AS tmpVal
                FROM ${tableName}
                WHERE currency_code='${this._currencyCode}'
                AND address='${address}'
                AND tmp_key='last_tx'
                `
    )) as TransactionScannersTmpDBModel[];
    const tmp = {};
    if (res) {
      let row;
      for (row of res) {
        // @ts-ignore
        tmp[row.tmpSubKey] = row.tmpVal;
      }
    }
    return tmp;
  }

  async saveCache(address: string, subKey: string, value: string) {
    const now = new Date().getTime();
    const prepared = [
      {
        currency_code: this._currencyCode,
        address: address,
        tmp_key: 'last_tx',
        tmp_sub_key: subKey,
        tmp_val: value,
        created_at: now
      }
    ];
    await Database.createModel(tableName, prepared);
  }
}

export default new OneTmpDS();
