/**
 * @version 0.20
 * https://github.com/trezor/blockbook/blob/master/docs/api.md
 * https://doge1.trezor.io/api/v2/utxo/D5oKvWEibVe74CXLASmhpkRpLoyjgZhm71
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import DogeUnspentsProvider from '../../doge/providers/DogeUnspentsProvider';

// import Database from '@app/appstores/DataSource/Database';
import { Database } from '@database';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftDict from '@crypto/common/BlocksoftDict';
import { Q } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';
import { AccountDBModel } from '@database/models/account';
import { WalletPubDBModel } from '@database/models/wallet-pub';

const CACHE_FOR_CHANGE: { [key: string]: any } = {};

export default class BtcUnspentsProvider
  extends DogeUnspentsProvider
  implements AirDAOBlockchainTypes.UnspentsProvider
{
  static async getCache(walletHash: string, currencyCode = 'BTC') {
    if (typeof CACHE_FOR_CHANGE[walletHash] !== 'undefined') {
      return CACHE_FOR_CHANGE[walletHash];
    }
    const mainCurrencyCode = currencyCode === 'LTC' ? 'LTC' : 'BTC';
    const segwitPrefix =
      BlocksoftDict.CurrenciesForTests[mainCurrencyCode + '_SEGWIT']
        .addressPrefix;

    AirDAOCryptoLog.log(
      currencyCode +
        ' ' +
        mainCurrencyCode +
        '  BtcUnspentsProvider.getCache ' +
        walletHash +
        ' started as ' +
        JSON.stringify(CACHE_FOR_CHANGE[walletHash])
    );

    // const sqlPub = `SELECT wallet_pub_value as walletPub
    //         FROM wallet_pub
    //         WHERE wallet_hash = '${walletHash}
    //         AND currency_code='${mainCurrencyCode}'
    //     `;
    const resPub = (await Database.query(
      DatabaseTable.WalletPub,
      Q.and(
        Q.where('hash', Q.eq(walletHash)),
        Q.where('currency_code', Q.eq(mainCurrencyCode))
      )
    )) as WalletPubDBModel[];
    if (resPub && resPub && resPub.length > 0) {
      // const sql = `SELECT account.address
      //       FROM account
      //       WHERE account.wallet_hash = '${walletHash}
      //       AND currency_code='${mainCurrencyCode}' AND (already_shown IS NULL OR already_shown=0)
      //       AND derivation_type!='main'
      //       ORDER BY derivation_index ASC
      //   `;
      const res = (await Database.query(
        DatabaseTable.Accounts,
        Q.and(
          Q.where('hash', Q.eq(walletHash)),
          Q.where('currency_code', Q.eq(mainCurrencyCode)),
          Q.or(
            Q.where('already_shown', Q.eq(null)),
            Q.where('already_shown', Q.eq(0))
          ),
          Q.where('derivation_type', Q.notEq('main'))
        ),
        Q.sortBy('derivation_index', 'asc')
      )) as AccountDBModel[];
      for (const row of res) {
        const prefix =
          row.address.indexOf(segwitPrefix) === 0
            ? segwitPrefix
            : row.address.substr(0, 1);
        await AirDAOCryptoLog.log(
          currencyCode +
            ' ' +
            mainCurrencyCode +
            ' BtcUnspentsProvider.getCache started HD CACHE_FOR_CHANGE ' +
            walletHash
        );
        // @ts-ignore
        if (typeof CACHE_FOR_CHANGE[walletHash] === 'undefined') {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash] = {};
        }
        // @ts-ignore
        if (
          typeof CACHE_FOR_CHANGE[walletHash][prefix] === 'undefined' ||
          CACHE_FOR_CHANGE[walletHash][prefix] === ''
        ) {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash][prefix] = row.address;
          // @ts-ignore
          await AirDAOCryptoLog.log(
            currencyCode +
              ' ' +
              mainCurrencyCode +
              ' BtcUnspentsProvider.getCache started HD CACHE_FOR_CHANGE ' +
              walletHash +
              ' ' +
              prefix +
              ' changed ' +
              JSON.stringify(CACHE_FOR_CHANGE[walletHash])
          );
        }
      }
    } else {
      // const sql = `SELECT account.address
      //       FROM account
      //       WHERE account.wallet_hash = '${walletHash}'
      //       AND currency_code='${mainCurrencyCode}'
      //   `;
      const res = (await Database.query(
        DatabaseTable.Accounts,
        Q.and(
          Q.where('hash', Q.eq(walletHash)),
          Q.where('currency_code', mainCurrencyCode)
        )
      )) as AccountDBModel[];
      for (const row of res) {
        // @ts-ignore
        await AirDAOCryptoLog.log(
          currencyCode +
            '/' +
            mainCurrencyCode +
            ' BtcUnspentsProvider.getUnspents started CACHE_FOR_CHANGE ' +
            walletHash
        );
        if (typeof CACHE_FOR_CHANGE[walletHash] === 'undefined') {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash] = {};
        }
        const prefix =
          row.address.indexOf(segwitPrefix) === 0
            ? segwitPrefix
            : row.address.substr(0, 1);
        // @ts-ignore
        CACHE_FOR_CHANGE[walletHash][prefix] = row.address;
      }
    }
    if (typeof CACHE_FOR_CHANGE[walletHash] === 'undefined') {
      throw new Error(
        currencyCode +
          '/' +
          mainCurrencyCode +
          ' BtcUnspentsProvider no CACHE_FOR_CHANGE retry for ' +
          walletHash
      );
    }
    return CACHE_FOR_CHANGE[walletHash];
  }

  _isMyAddress(
    voutAddress: string,
    address: string,
    walletHash: string
  ): string {
    // @ts-ignore
    if (
      typeof CACHE_FOR_CHANGE[walletHash] === 'undefined' ||
      !CACHE_FOR_CHANGE[walletHash]
    ) {
      return '';
    }
    // @ts-ignore
    let found = '';
    for (const key in CACHE_FOR_CHANGE[walletHash]) {
      AirDAOCryptoLog.log(
        'CACHE_FOR_CHANGE[walletHash][key]',
        key + '_' + CACHE_FOR_CHANGE[walletHash][key]
      );
      if (voutAddress === CACHE_FOR_CHANGE[walletHash][key]) {
        found = voutAddress;
      }
    }
    return found;
  }

  async getUnspents(
    address: string
  ): Promise<AirDAOBlockchainTypes.UnspentTx[]> {
    const mainCurrencyCode =
      this._settings.currencyCode === 'LTC' ? 'LTC' : 'BTC';
    const segwitPrefix =
      BlocksoftDict.CurrenciesForTests[mainCurrencyCode + '_SEGWIT']
        .addressPrefix;

    const sqlPub = `SELECT wallet_pub_value as walletPubValue
            FROM ${DatabaseTable.WalletPub}
            WHERE hash = (SELECT hash FROM ${DatabaseTable.Accounts} WHERE address='${address}')
            AND currency_code='${mainCurrencyCode}'
        `;
    const totalUnspents = [];
    // const resPub = await Database.query(sqlPub);
    const resPub = (await Database.unsafeRawQuery(
      DatabaseTable.WalletPub,
      sqlPub
    )) as WalletPubDBModel[];
    if (resPub && resPub && resPub.length > 0) {
      for (const row of resPub) {
        const unspents = await super.getUnspents(row.walletPubValue);
        if (unspents) {
          for (const unspent of unspents) {
            totalUnspents.push(unspent);
          }
        }
      }
      const sqlAdditional = `SELECT account.address, account.derivation_path as derivationPath, hash
            FROM ${DatabaseTable.Accounts}
            WHERE account.hash = (SELECT hash FROM ${DatabaseTable.Accounts} WHERE address='${address}')
            AND account.derivation_path = 'm/49quote/0quote/0/1/0'
            AND currency_code='${mainCurrencyCode}'
            `;
      const resAdditional = (await Database.unsafeRawQuery(
        DatabaseTable.Accounts,
        sqlAdditional
      )) as AccountDBModel[];
      if (resAdditional && resAdditional && resAdditional.length > 0) {
        for (const row of resAdditional) {
          const unspents = await super.getUnspents(row.address);
          if (unspents) {
            for (const unspent of unspents) {
              unspent.address = row.address;
              unspent.derivationPath = Database.unEscapeString(
                row.derivationPath
              );
              totalUnspents.push(unspent);
            }
          }
        }
      }

      const sql = `SELECT account.address, account.derivation_path as derivationPath, hash
            FROM account
            WHERE account.hash = (SELECT hash FROM account WHERE address='${address}')
            AND currency_code='${mainCurrencyCode}' AND (already_shown IS NULL OR already_shown=0)
            AND derivation_type!='main'
            ORDER BY derivation_index ASC
        `;
      const res = (await Database.unsafeRawQuery(
        DatabaseTable.Accounts,
        sql
      )) as AccountDBModel[];
      for (const row of res) {
        const walletHash = row.hash.hash;
        const prefix =
          row.address.indexOf(segwitPrefix) === 0
            ? segwitPrefix
            : row.address.substring(0, 1);
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' ' +
            mainCurrencyCode +
            ' BtcUnspentsProvider.getUnspents started HD CACHE_FOR_CHANGE ' +
            address +
            ' walletHash ' +
            walletHash
        );
        // @ts-ignore
        if (typeof CACHE_FOR_CHANGE[walletHash] === 'undefined') {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash] = {};
        }
        // @ts-ignore
        if (
          typeof CACHE_FOR_CHANGE[walletHash][prefix] === 'undefined' ||
          CACHE_FOR_CHANGE[walletHash][prefix] === ''
        ) {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash][prefix] = row.address;
          // @ts-ignore
          await AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' ' +
              mainCurrencyCode +
              ' BtcUnspentsProvider.getUnspents started HD CACHE_FOR_CHANGE ' +
              address +
              ' walletHash ' +
              walletHash +
              ' ' +
              prefix +
              ' changed ' +
              JSON.stringify(CACHE_FOR_CHANGE[walletHash])
          );
        }
      }
    } else {
      const sql = `SELECT account.address, account.derivation_path as derivationPath, hash
            FROM ${DatabaseTable.Accounts}
            WHERE account.hash = (SELECT hash FROM ${DatabaseTable.Accounts} WHERE address='${address}')
            AND currency_code='${mainCurrencyCode}'
        `;
      const res = (await Database.unsafeRawQuery(
        DatabaseTable.Accounts,
        sql
      )) as AccountDBModel[];
      for (const row of res) {
        const walletHash = row.hash.hash;
        const unspents = await super.getUnspents(row.address);
        // @ts-ignore
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            '/' +
            mainCurrencyCode +
            ' BtcUnspentsProvider.getUnspents started CACHE_FOR_CHANGE ' +
            address +
            ' ' +
            row.address +
            ' walletHash ' +
            walletHash
        );
        if (typeof CACHE_FOR_CHANGE[walletHash] === 'undefined') {
          // @ts-ignore
          CACHE_FOR_CHANGE[walletHash] = {};
        }
        const prefix =
          row.address.indexOf(segwitPrefix) === 0
            ? segwitPrefix
            : row.address.substr(0, 1);
        // @ts-ignore
        CACHE_FOR_CHANGE[walletHash][prefix] = row.address;
        if (unspents) {
          for (const unspent of unspents) {
            unspent.address = row.address;
            unspent.derivationPath = Database.unEscapeString(
              row.derivationPath
            );
            totalUnspents.push(unspent);
          }
        }
      }
    }
    // @ts-ignore
    if (totalUnspents.length > 10) {
      await AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' ' +
          mainCurrencyCode +
          ' BtcUnspentsProvider.getUnspents finished ' +
          address +
          ' total ' +
          totalUnspents.length,
        totalUnspents.slice(0, 10)
      );
    } else {
      await AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' ' +
          mainCurrencyCode +
          ' BtcUnspentsProvider.getUnspents finished ' +
          address +
          ' total ' +
          totalUnspents.length,
        totalUnspents
      );
    }
    return totalUnspents;
  }
}
