/* eslint-disable camelcase */
/**
 * @author Javid
 * @version 0.32
 */
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import { DatabaseTable } from '@appTypes';
import { Database } from '@database';

const tableName = DatabaseTable.TransactionRaw;

class EthRawDS {
  /**
   * @type {string}
   * @private
   */
  _currencyCode = 'ETH';

  async cleanRawHash(data: boolean | undefined) {
    AirDAOCryptoLog.log('EthRawDS cleanRawHash ', data);

    const now = new Date().toISOString();
    const sql = `UPDATE ${tableName}
        SET is_removed=1, removed_at = '${now}'
        WHERE
        (is_removed=0 OR is_removed IS NULL)
        AND (currency_code='ETH' OR currency_code='ETH_ROPSTEN')
        AND transaction_hash='${data.transactionHash}'`;
    await Database.unsafeRawQuery(tableName, sql);
  }

  async saveRaw(data: {
    address: any;
    currencyCode: any;
    transactionUnique: any;
    transactionHash: any;
    transactionRaw: any;
    transactionLog: any;
  }) {
    if (typeof data.currencyCode !== 'undefined') {
      this._currencyCode =
        data.currencyCode === 'ETH_ROPSTEN' ? 'ETH_ROPSTEN' : 'ETH';
    }
    const now = new Date().getTime();

    const sql = `UPDATE ${tableName}
        SET is_removed=1, removed_at = '${now}'
        WHERE
        (is_removed=0 OR is_removed IS NULL)
        AND currency_code='${this._currencyCode}'
        AND address='${data.address.toLowerCase()}'
        AND transaction_unique_key='${data.transactionUnique.toLowerCase()}'`;
    await Database.unsafeRawQuery(tableName, sql);

    const prepared = [
      {
        currency_code: this._currencyCode,
        address: data.address.toLowerCase(),
        transaction_unique_key: data.transactionUnique.toLowerCase(),
        transaction_hash: data.transactionHash,
        transaction_raw: data.transactionRaw,
        transaction_log: Database.escapeString(
          JSON.stringify(data.transactionLog)
        ),
        created_at: now,
        is_removed: 0
      }
    ];
    await Database.createModel(tableName, prepared);
  }
}

export default new EthRawDS();
