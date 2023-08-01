import * as bitcoin from 'bitcoinjs-lib';
import * as basexLib from 'base-x';

const basex = basexLib.default(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

export default class XrpAddressProcessor {
  async setBasicRoot(root: string): Promise<void> {}

  /**
   * @param {string|Buffer} privateKey
   * @param {*} data
   * @returns {Promise<{privateKey: string, address: string, addedData: *}>}
   */
  async getAddress(
    privateKey: string | Buffer,
    data: any = {}
  ): Promise<{ privateKey: string; address: string; addedData: any }> {
    privateKey = Buffer.from(privateKey);
    const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey);
    const btcPrivateKey: string = keyPair.toWIF();
    const ripplePrivateKey: string = basex
      .decode(btcPrivateKey)
      // @ts-ignore
      .toString('hex')
      .slice(2, 66);
    // @ts-ignore
    const btcAddress: string = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin
    }).address;
    const rippleAddress: string = basex.encode(
      basexLib
        .default('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
        .decode(btcAddress)
    );
    const addedData: { publicKey?: string } = {};
    if (data && data.publicKey) {
      addedData.publicKey = data.publicKey.toString('hex');
    }
    return { address: rippleAddress, privateKey: ripplePrivateKey, addedData };
  }
}
