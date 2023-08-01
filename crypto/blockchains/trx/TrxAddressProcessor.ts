/**
 * @version 0.5
 */
import TronUtils from './ext/TronUtils';

interface AddressData {
  privateKey: string;
  address: string;
  addedData: {
    addressHex: string;
    pubKey: string;
  };
}

export default class TrxAddressProcessor {
  async setBasicRoot(root: any) {}

  /**
   * @param {string|Buffer} privateKey
   * @param {*} data
   * @returns {Promise<AddressData>}
   */
  async getAddress(
    privateKey: string | Buffer,
    data: any = {}
  ): Promise<AddressData> {
    const pubKey: string = TronUtils.privHexToPubHex(privateKey);
    const addressHex: string = TronUtils.pubHexToAddressHex(pubKey);
    const address: string = TronUtils.addressHexToStr(addressHex);
    return {
      address,
      privateKey: privateKey.toString('hex'),
      addedData: { addressHex, pubKey }
    };
  }
}
