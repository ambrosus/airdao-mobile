/**
 * @version 0.52
 */
import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';
import AirDAOKeys from '@lib/helpers/AirDAOKeys';
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import config from '@constants/config';

const CACHE: { [key: string]: any } = {};

export default {
  /**
   * @param discoverFor.mnemonic
   * @param discoverFor.derivationPath
   * @param discoverFor.derivationIndex
   * @param discoverFor.derivationType
   * @param discoverFor.path
   * @param discoverFor.currencyCode
   * @param discoverFor.walletHash
   * @param discoverFor.addressToCheck
   * @returns {Promise<{privateKey: string}>}
   */
  async getPrivateKey(
    discoverFor: {
      mnemonic?: any;
      addressToCheck: any;
      walletHash: any;
      derivationPath: any;
      currencyCode: any;
      derivationIndex?: any;
      path?: any;
    },
    source: string
  ) {
    const path =
      typeof discoverFor.path !== 'undefined' && discoverFor.path
        ? discoverFor.path
        : discoverFor.derivationPath;
    if (path === 'false' || !path) {
      await AirDAOCryptoLog.log(
        'AirDAOTransferPrivateKeysDiscover private key not discovered as path = false from ' +
          source
      );
    }
    const discoverForKey = AirDAOKeysStorage.getAddressCacheKey(
      discoverFor.walletHash,
      path.replace(/[']/g, 'quote'),
      discoverFor.currencyCode
    );
    await AirDAOCryptoLog.log(
      `'AirDAOTransferPrivateKeysDiscover.getPrivateKey actually inited ',
      ${{ address: discoverFor.addressToCheck, path, discoverForKey }}`
    );
    let result = CACHE[discoverForKey];
    if (result) {
      return result;
    }
    result = await AirDAOKeysStorage.getAddressCache(discoverForKey);
    if (result) {
      CACHE[discoverForKey] = result;
      return result;
    }

    try {
      result = await AirDAOKeys.discoverOne(discoverFor);
      if (
        discoverFor.addressToCheck &&
        discoverFor.addressToCheck !== result.address
      ) {
        const tmpPath = [
          `m/84'/0'/0'/0/0`,
          `m/84'/0'/0'/0/1`,
          `m/44'/0'/0'/0/0`,
          `m/44'/0'/0'/0/1`,
          `m/49'/0'/0'/0/0`,
          `m/49'/0'/0'/0/1`,
          `m/44'/0`,
          `m/44'/1`,
          `m/49'/0`,
          `m/49'/1`,
          `m/84'/0`,
          `m/84'/1`,
          `m/0`
        ];
        let tmpFound = false;
        // tslint:disable-next-line:no-shadowed-variable
        for (const path of tmpPath) {
          const clone = JSON.parse(JSON.stringify(discoverFor));
          clone.derivationPath = path;
          const result2 = await AirDAOKeys.discoverOne(clone);
          if (discoverFor.addressToCheck === result2.address) {
            result = result2;
            tmpFound = true;
            break;
          }
        }
        if (!tmpFound) {
          throw new Error('invalid address');
        }
      }
      await AirDAOKeysStorage.setAddressCache(discoverForKey, result);
    } catch (e: any) {
      if (config.debug.appErrors) {
        console.log(
          'AirDAOTransferPrivateKeysDiscover private key error ' +
            e.message +
            ' from ' +
            source,
          e
        );
      }
      const clone = JSON.parse(JSON.stringify(discoverFor));
      const msg = e.message.toString().replace(discoverFor.mnemonic, '***');
      if (clone.mnemonic === '***') {
        clone.mnemonic = '*** already masked ***';
      } else {
        clone.mnemonic = '***';
      }
      throw new Error(
        'AirDAOTransferPrivateKeysDiscover private key error ' +
          msg +
          ' from ' +
          source +
          ' this._data=' +
          JSON.stringify(clone)
      );
    }
    CACHE[discoverForKey] = result;
    return result;
  }
};
