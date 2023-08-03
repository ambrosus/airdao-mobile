/**
 * @version 0.52
 */
import BlocksoftKeysStorage from '@crypto/actions/BlocksoftKeysStorage/BlocksoftKeysStorage';
import BlocksoftKeys from '@crypto/actions/BlocksoftKeys/BlocksoftKeys';
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
        'BlocksoftTransferPrivateKeysDiscover private key not discovered as path = false from ' +
          source
      );
    }
    const discoverForKey = BlocksoftKeysStorage.getAddressCacheKey(
      discoverFor.walletHash,
      path.replace(/[']/g, 'quote'),
      discoverFor.currencyCode
    );
    await AirDAOCryptoLog.log(
      `'BlocksoftTransferPrivateKeysDiscover.getPrivateKey actually inited ',
      ${{ address: discoverFor.addressToCheck, path, discoverForKey }}`
    );
    let result = CACHE[discoverForKey];
    if (result) {
      return result;
    }
    result = await BlocksoftKeysStorage.getAddressCache(discoverForKey);
    if (result) {
      CACHE[discoverForKey] = result;
      return result;
    }

    try {
      if (
        typeof discoverFor.mnemonic === 'undefined' ||
        !discoverFor.mnemonic
      ) {
        await AirDAOCryptoLog.log(
          'BlocksoftTransferPrivateKeysDiscover.getPrivateKey actually redo mnemonic ' +
            discoverFor.walletHash
        ),
          (discoverFor.mnemonic = BlocksoftKeysStorage.getWalletMnemonic(
            discoverFor.walletHash,
            'getPrivateKey'
          ));
      }
      result = await BlocksoftKeys.discoverOne(discoverFor);
      if (
        discoverFor.addressToCheck &&
        discoverFor.addressToCheck !== result.address
      ) {
        await AirDAOCryptoLog.log(
          'BlocksoftTransferPrivateKeysDiscover private key discovered is not for address you path=' +
            discoverFor.derivationPath +
            ' set ' +
            result.address +
            '!=' +
            discoverFor.addressToCheck +
            ' key=' +
            discoverForKey +
            ' from ' +
            source
        );

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
          const result2 = await BlocksoftKeys.discoverOne(clone);
          if (discoverFor.addressToCheck === result2.address) {
            await AirDAOCryptoLog.log(
              'BlocksoftTransferPrivateKeysDiscover private key rediscovered FOUND address path=' +
                clone.derivationPath +
                '  set ' +
                result2.address +
                '=' +
                discoverFor.addressToCheck +
                ' from ' +
                source
            );
            result = result2;
            tmpFound = true;
            break;
          } else {
            await AirDAOCryptoLog.log(
              'BlocksoftTransferPrivateKeysDiscover private key rediscovered is not for address path=' +
                clone.derivationPath +
                '  set ' +
                result2.address +
                '!=' +
                discoverFor.addressToCheck +
                ' from ' +
                source
            );
          }
        }
        if (!tmpFound) {
          throw new Error('invalid address');
        }
      }
      await BlocksoftKeysStorage.setAddressCache(discoverForKey, result);
    } catch (e: any) {
      if (config.debug.appErrors) {
        console.log(
          'BlocksoftTransferPrivateKeysDiscover private key error ' +
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
        'BlocksoftTransferPrivateKeysDiscover private key error ' +
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
