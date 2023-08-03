/* eslint-disable camelcase */
/**
 * @author Javid
 * @version 0.32
 */
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BlocksoftCryptoLog from '../../../common/BlocksoftCryptoLog';
import { DatabaseTable } from '@appTypes';
import { Database } from '@database';
import { TransactionRawDBModel } from '@database/models/transactions-raw';

const tableName = DatabaseTable.TransactionRaw;

class EthRawDS {
  /**
   * @type {string}
   * @private
   */
  _currencyCode = 'ETH';

  _trezorServer = 'none';
  private _infuraProjectId: any; // TODO fix any

  async getForAddress(data) {
    try {
      if (typeof data.currencyCode !== 'undefined') {
        this._currencyCode =
          data.currencyCode === 'ETH_ROPSTEN' ? 'ETH_ROPSTEN' : 'ETH';
      }
      const sql = `
        SELECT id,
        transaction_unique_key AS transactionUniqueKey,
        transaction_hash AS transactionHash,
        transaction_raw AS transactionRaw,
        transaction_log AS transactionLog,
        broadcast_log AS broadcastLog,
        broadcast_updated AS broadcastUpdated,
        created_at AS transactionCreated,
        is_removed, removed_at
        FROM transactions_raw
        WHERE
        (is_removed=0 OR is_removed IS NULL)
        AND currency_code='${this._currencyCode}'
        AND address='${data.address.toLowerCase()}'`;
      const result = (await Database.unsafeRawQuery(
        tableName,
        sql
      )) as TransactionRawDBModel[];
      if (!result || !result || result.length === 0) {
        return {};
      }

      const ret: { [key: string]: unknown } = {}; // TODO fix unknown

      if (this._trezorServer === 'none') {
        if (this._currencyCode === 'ETH') {
          try {
            this._trezorServer =
              await BlocksoftExternalSettings.getTrezorServer(
                'ETH_TREZOR_SERVER',
                'ETH.Broadcast'
              );
            this._infuraProjectId = BlocksoftExternalSettings.getStatic(
              'ETH_INFURA_PROJECT_ID',
              'ETH.Broadcast'
            );
          } catch (e) {
            throw new Error(e.message + ' inside trezorServer');
          }
        } else {
          this._trezorServer = await BlocksoftExternalSettings.getTrezorServer(
            'ETH_ROPSTEN_TREZOR_SERVER',
            'ETH.Broadcast'
          );
        }
      }

      const now = new Date().getTime();

      for (const row of result) {
        try {
          ret[row.transactionUniqueKey] = row;
          let transactionLog;
          try {
            transactionLog = row.transactionLog
              ? JSON.parse(Database.unEscapeString(row.transactionLog))
              : row.transactionLog;
          } catch (e) {
            // do nothing
          }

          if (
            transactionLog &&
            typeof transactionLog.currencyCode !== 'undefined' &&
            (typeof transactionLog.successResult === 'undefined' ||
              !transactionLog.successResult)
          ) {
            // const { apiEndpoints } = config.proxy;
            // const baseURL = MarketingEvent.DATA.LOG_TESTER
            //   ? apiEndpoints.baseURLTest
            //   : apiEndpoints.baseURL;
            // const successProxy = baseURL + '/send/sendtx';
            // let checkResult = false;
            // try {
            //   transactionLog.selectedFee.isRebroadcast = true;
            //   checkResult = await BlocksoftAxios.post(successProxy, {
            //     raw: row.transactionRaw,
            //     txRBF:
            //       typeof transactionLog.txRBF !== 'undefined'
            //         ? transactionLog.txRBF
            //         : false,
            //     logData: transactionLog,
            //     marketingData: MarketingEvent.DATA
            //   });
            //   await BlocksoftCryptoLog.log(
            //     this._currencyCode + ' EthRawDS.send proxy success result',
            //     JSON.parse(JSON.stringify(checkResult))
            //   );
            // } catch (e3) {
            //   await BlocksoftCryptoLog.log(
            //     this._currencyCode +
            //       ' EthRawDS.send proxy success error ' +
            //       e3.message
            //   );
            // }
            // if (checkResult && typeof checkResult.data !== 'undefined') {
            //   transactionLog.successResult = checkResult.data;
            // }
            // await Database.updateModel(tableName, row.id, {
            //   transactionLog: Database.escapeString(
            //     JSON.stringify(transactionLog)
            //   )
            // });
          }

          let broadcastLog = '';
          let link = '';
          let broad;
          const updateObj = {
            broadcastUpdated: now,
            is_removed: '0'
          };
          if (
            this._currencyCode === 'ETH' ||
            this._currencyCode === 'ETH_ROPSTEN'
          ) {
            link = this._trezorServer + '/api/v2/sendtx/';
            try {
              broad = await BlocksoftAxios.post(link, row.transactionRaw);
              broadcastLog = ' broadcasted ok ' + JSON.stringify(broad.data);
              updateObj.is_removed = '1';
              updateObj.removed_at = now;
            } catch (err) {
              const e = err as unknown as any;
              if (
                e.message.indexOf('transaction underpriced') !== -1 ||
                e.message.indexOf('already known') !== -1
              ) {
                updateObj.is_removed = '1';
                broadcastLog += ' already known';
              } else {
                updateObj.is_removed = '0';
                broadcastLog += e.message;
              }
            }
            broadcastLog += ' ' + link + '; ';
          }

          if (this._currencyCode === 'ETH') {
            link =
              'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&apikey=YourApiKeyToken&hex=';
            let broadcastLog1 = '';
            try {
              broad = await BlocksoftAxios.get(link + row.transactionRaw);
              if (typeof broad.data.error !== 'undefined') {
                throw new Error(JSON.stringify(broad.data.error));
              }
              broadcastLog1 = ' broadcasted ok ' + JSON.stringify(broad.data);
              updateObj.is_removed += '1';
              updateObj.removed_at = now;
            } catch (err) {
              const e = err as unknown as any;
              if (
                e.message.indexOf('transaction underpriced') !== -1 ||
                e.message.indexOf('already known') !== -1
              ) {
                updateObj.is_removed += '1';
                broadcastLog1 += ' already known';
              } else {
                updateObj.is_removed += '0';
                broadcastLog1 += e.message;
              }
            }
            broadcastLog1 += ' ' + link + '; ';
            link = 'https://mainnet.infura.io/v3/' + this._infuraProjectId;
            let broadcastLog2 = '';
            try {
              broad = await BlocksoftAxios.post(link, {
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: [row.transactionRaw],
                id: 1
              });
              if (typeof broad.data.error !== 'undefined') {
                throw new Error(JSON.stringify(broad.data.error));
              }
              broadcastLog2 = ' broadcasted ok ' + JSON.stringify(broad.data);
              updateObj.is_removed += '1';
              updateObj.removed_at = now;
            } catch (err) {
              const e = err as unknown as any;
              if (
                e.message.indexOf('transaction underpriced') !== -1 ||
                e.message.indexOf('already known') !== -1
              ) {
                updateObj.is_removed += '1';
                broadcastLog2 += ' already known';
              } else {
                updateObj.is_removed += '0';
                broadcastLog2 += e.message;
              }
            }
            broadcastLog2 += ' ' + link + '; ';
            if (updateObj.is_removed === '111') {
              // do ALL!
              updateObj.is_removed = 1;
            } else {
              updateObj.is_removed = 0;
            }

            broadcastLog =
              new Date().toISOString() +
              ' ' +
              broadcastLog +
              ' ' +
              broadcastLog1 +
              ' ' +
              broadcastLog2 +
              ' ' +
              (row.broadcastLog ? row.broadcastLog.substr(0, 1000) : '');
          } else if (this._currencyCode === 'ETH_ROPSTEN') {
            if (updateObj.is_removed === '1') {
              // do ALL!
              updateObj.is_removed = 1;
            } else {
              updateObj.is_removed = 0;
            }

            broadcastLog =
              new Date().toISOString() +
              ' ' +
              broadcastLog +
              ' ' +
              (row.broadcastLog ? row.broadcastLog.substr(0, 1000) : '');
          }

          if (
            this._currencyCode === 'ETH' ||
            this._currencyCode === 'ETH_ROPSTEN'
          ) {
            updateObj.broadcastLog = broadcastLog;
            await Database.updateModel(tableName, row.id, updateObj);
          }
        } catch (err) {
          const e = err as unknown as any;
          throw new Error(e.message + ' inside row ' + row.transactionHash);
        }
      }
      return ret;
    } catch (err) {
      const e = err as unknown as any;
      throw new Error(e.message + ' on EthRawDS.getAddress');
    }
  }

  async cleanRawHash(data) {
    BlocksoftCryptoLog.log('EthRawDS cleanRawHash ', data);

    const now = new Date().toISOString();
    const sql = `UPDATE ${tableName}
        SET is_removed=1, removed_at = '${now}'
        WHERE
        (is_removed=0 OR is_removed IS NULL)
        AND (currency_code='ETH' OR currency_code='ETH_ROPSTEN')
        AND transaction_hash='${data.transactionHash}'`;
    await Database.unsafeRawQuery(tableName, sql);
  }

  async cleanRaw(data) {
    BlocksoftCryptoLog.log('EthRawDS cleanRaw ', data);

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
        AND transaction_unique_key='${data.transactionUnique}'`;
    await Database.unsafeRawQuery(tableName, sql);
  }

  async saveRaw(data) {
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
