/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Database } from '@database';
import { TransactionScannersTmpDBModel } from '@database/models';
import { Q } from '@nozbe/watermelondb';

const tableName = DatabaseTable.TransactionScannersTmp;

class BsvTmpDS {
  /**
   * @type {string}
   * @private
   */
  _currencyCode = 'BSV';

  _valKey = 'txs';

  _isSaved = false;

  async getCache() {
    const res: TransactionScannersTmpDBModel[] | undefined =
      (await Database.query(
        tableName,
        Q.and(
          Q.where('currency_code', Q.eq(this._currencyCode)),
          Q.where('tmp_key', Q.eq(this._valKey))
        )
      )) as TransactionScannersTmpDBModel[];
    let tmp = {};
    const idsToRemove = [];
    if (res) {
      for (const row of res) {
        if (typeof tmp[row.tmp_sub_key] !== 'undefined') {
          idsToRemove.push(row.id);
        } else {
          try {
            tmp[row.tmp_sub_key] = JSON.parse(
              Database.unEscapeString(row.tmp_val)
            );
          } catch (e) {
            idsToRemove.push(row.id);
          }
        }
      }
      if (idsToRemove.length > 0) {
        // TODO check this
        await Database.unsafeRawQuery(
          tableName,
          `DELETE FROM ${tableName} WHERE id IN (${idsToRemove.join(',')})`
        );
      }
    }
    return tmp;
  }

  async saveCache(txid: string, value: unknown) {
    const tmp = Database.escapeString(JSON.stringify(value));
    const now = new Date().toISOString();
    const prepared = {
      currency_code: this._currencyCode,
      tmp_key: this._valKey,
      tmp_sub_key: txid,
      tmp_val: tmp,
      created_at: now
    };
    await Database.createModel(DatabaseTable.TransactionScannersTmp, prepared);
  }
}

export default new BsvTmpDS();
