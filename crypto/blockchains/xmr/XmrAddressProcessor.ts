/**
 * @version 0.11
 * https://coinomi.github.io/bip39-monero/
 *
 *
 * let mnemonic = ''
 * let results = await BlocksoftKeys.discoverAddresses({ mnemonic, fullTree: false, fromIndex: 0, toIndex: 1, currencyCode: ['XMR'] })
 * console.log('r', results['XMR'][0])
 */
import MoneroUtils from './ext/MoneroUtils';
import MoneroMnemonic from './ext/MoneroMnemonic';
import { soliditySha3 } from 'web3-utils';
import BlocksoftAxios from '../../common/BlocksoftAxios';
import BlocksoftCryptoLog from '../../common/BlocksoftCryptoLog';
import BlocksoftSecrets from '@crypto/actions/BlocksoftSecrets/BlocksoftSecrets';
import config from '@constants/config';

import bitcoin from 'bitcoinjs-lib';
import networksConstants from '../../common/ext/networks-constants';

const BTC = networksConstants.mainnet.network;

export default class XmrAddressProcessor {
  private _root: boolean | any = false;

  async setBasicRoot(root: any) {
    this._root = root;
  }

  /**
   * @param {string|Buffer} privateKey
   * @param {*} data.publicKey
   * @param {*} data.walletHash
   * @param {*} data.derivationPath
   * @param {*} data.derivationIndex
   * @param {*} data.derivationType
   * @returns {Promise<{privateKey: string, address: string, addedData: *}>}
   */
  async getAddress(
    privateKey: string | Buffer,
    data: any = {},
    superPrivateData: any = {}
  ): Promise<{
    address: string;
    privateKey: string;
    addedData: {
      publicViewKey: string;
      publicSpendKey: string;
      derivationIndex: number;
      mymoneroError: number;
    };
  }> {
    let walletMnemonic = false;
    try {
      walletMnemonic = await BlocksoftSecrets.getWords({
        currencyCode: 'XMR',
        mnemonic: superPrivateData.mnemonic
      });
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          'XmrAddressProcessor.getAddress recheck mnemonic error ' + e.message
        );
      }
    }
    if (!walletMnemonic) {
      return {
        address: 'invalidRecheck1',
        privateKey: '',
        addedData: {
          publicViewKey: '',
          publicSpendKey: '',
          derivationIndex: 0,
          mymoneroError: 0
        }
      };
    }

    if (
      typeof data.derivationType !== 'undefined' &&
      data.derivationType &&
      data.derivationType !== 'main'
    ) {
      return {
        address: '',
        privateKey: '',
        addedData: {
          publicViewKey: '',
          publicSpendKey: '',
          derivationIndex: 0,
          mymoneroError: 0
        }
      };
    }
    if (
      typeof data.derivationIndex === 'undefined' ||
      !data.derivationIndex ||
      data.derivationIndex === 0
    ) {
      const child = this._root.derivePath("m/44'/128'/0'/0/0");
      privateKey = child.privateKey;
    } else {
      privateKey = Buffer.from(privateKey);
    }
    const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: BTC });
    const rawPrivateKey = keyPair.privateKey;
    const rawSecretSpendKey = soliditySha3(rawPrivateKey);
    const rawSecretSpendKeyBuffer = Buffer.from(
      rawSecretSpendKey.substr(2),
      'hex'
    );

    const secretSpendKey = MoneroUtils.sc_reduce32(rawSecretSpendKeyBuffer);

    const secretViewKey = MoneroUtils.hash_to_scalar(secretSpendKey);

    const words = MoneroMnemonic.secret_spend_key_to_words(
      MoneroUtils.normString(secretSpendKey),
      typeof data.walletHash !== 'undefined' ? data.walletHash : 'none'
    );

    if (words !== walletMnemonic.toString()) {
      return {
        address: 'invalidRecheck2',
        privateKey: '',
        addedData: {
          publicViewKey: '',
          publicSpendKey: '',
          derivationIndex: 0,
          mymoneroError: 0
        }
      };
    }

    const publicSpendKey =
      MoneroUtils.secret_key_to_public_key(secretSpendKey).toString('hex');

    const publicViewKey =
      MoneroUtils.secret_key_to_public_key(secretViewKey).toString('hex');

    const address = MoneroUtils.pub_keys_to_address(
      0,
      publicSpendKey,
      publicViewKey
    );

    let mymoneroError = 0;
    let linkParamsLogin = {};
    try {
      linkParamsLogin = {
        address,
        view_key: MoneroUtils.normString(secretViewKey.toString('hex')),
        create_account: true,
        generated_locally: true
      };
      const resLogin = await BlocksoftAxios.post(
        'https://api.mymonero.com:8443/login',
        linkParamsLogin
      );
      if (
        typeof resLogin.data === 'undefined' ||
        !resLogin.data ||
        typeof resLogin.data.new_address === 'undefined'
      ) {
        throw new Error('no data');
      }
    } catch (e: any) {
      BlocksoftCryptoLog.err(
        'XmrAddressProcessor !!!mymonero error!!! ' + e.message,
        JSON.stringify({
          linkParamsLogin,
          publicSpendKeyL: publicSpendKey.length,
          publicViewKeyL: publicViewKey.length
        })
      );
      mymoneroError = 1;
    }

    /*
            console.log({
                derivationPath : data.derivationPath,
                secretSpendKey,
                ss : Buffer.from(secretSpendKey, 'hex'),
                secretViewKey,
                sv : Buffer.from(secretViewKey, 'hex'),
                words,
                publicViewKey: publicViewKey.toString('hex'),
                publicSpendKey: publicSpendKey.toString('hex'),
                address
            })
            */

    return {
      address,
      privateKey:
        // @ts-ignore
        MoneroUtils.normString(secretSpendKey.toString('hex')) +
        '_' +
        // @ts-ignore
        MoneroUtils.normString(secretViewKey.toString('hex')),
      addedData: {
        publicViewKey: MoneroUtils.normString(publicViewKey),
        publicSpendKey: MoneroUtils.normString(publicSpendKey),
        derivationIndex: 0,
        mymoneroError
      }
    };
  }
}
