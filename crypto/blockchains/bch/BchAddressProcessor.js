/**
 * @version 0.5
 */
import BtcCashUtils from './ext/BtcCashUtils';
import BtcAddressProcessor from '../btc/address/BtcAddressProcessor';
import bitcoin from 'bitcoinjs-lib';

export default class BchAddressProcessor extends BtcAddressProcessor {
  /**
   * @param {string|Buffer} privateKey
   * @param {*} data
   * @returns {Promise<{privateKey: string, address: string, addedData: *}>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAddress(privateKey, _data = {}) {
    const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, {
      network: this._currentBitcoinNetwork
    });
    const publicKey = keyPair.publicKey;
    const address = BtcCashUtils.fromPublicKeyToAddress(publicKey);
    const legacyAddress = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this._currentBitcoinNetwork
    }).address;
    return {
      address,
      privateKey: keyPair.toWIF(),
      addedData: { legacyAddress }
    };
  }
}
