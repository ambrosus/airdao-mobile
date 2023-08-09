// TODO add Database
// @ts-ignore
// import Database from '@app/appstores/DataSource/Database';

import { DatabaseTable } from '@appTypes';
import { Database, TransactionScannersTmpDBModel } from '@database';

const tableName = DatabaseTable.TransactionScannersTmp;

class XvgTmpDS {
  _currencyCode = 'XVG';

  async getCache(address: any) {
    const res = (await Database.unsafeRawQuery(
      tableName,
      `
                SELECT tmp_key as tmpKey, tmp_sub_key as tmpSubKey, tmp_val as tmpVal
                FROM ${tableName}
                WHERE currency_code='${this._currencyCode}'
                AND address='${address}'
                AND (tmp_sub_key='coins' OR tmp_sub_key='data')
                `
    )) as TransactionScannersTmpDBModel[];
    const tmp = {};
    if (res) {
      for (const row of res) {
        let val = 1;
        if (row.tmpSubKey !== 'data') {
          val = JSON.parse(Database.unEscapeString(row.tmp_val));
        }
        tmp[row.tmpKey + '_' + row.tmpSubKey] = val;
      }
    }
    return tmp;
  }

  async saveCache(address: any, key: any, subKey: string, value: boolean) {
    const now = new Date().toISOString();
    const prepared = [
      {
        currency_code: this._currencyCode,
        address: address,
        tmp_key: key,
        tmp_sub_key: subKey,
        tmp_val: Database.escapeString(JSON.stringify(value)),
        created_at: now
      }
    ];
    Database.createModel(tableName, prepared);
  }
}

export default new XvgTmpDS();
