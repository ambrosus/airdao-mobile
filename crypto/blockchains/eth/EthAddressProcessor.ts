/**
 * @version 0.5
 */
import EthBasic from './basic/EthBasic';

export default class EthAddressProcessor extends EthBasic {
  async setBasicRoot(root) {}

  /**
   * @param {string|Buffer} privateKey
   * @param {*} data
   * @returns {Promise<{privateKey: string, address: string, addedData: *}>}
   */
  async getAddress(privateKey: string | Buffer, data = {}) {
    privateKey = '0x' + privateKey.toString('hex');
    const account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
    return { address: account.address, privateKey, addedData: false };
  }

  async signMessage(
    msg: string,
    privateKey: string
  ): Promise<{
    message: string;
    messageHash: string;
    v: string;
    r: string;
    s: string;
    signature: string;
  }> {
    if (privateKey.substr(0, 2) !== '0x') {
      privateKey = '0x' + privateKey;
    }
    const signData = await this._web3.eth.accounts.sign(msg, privateKey);
    return signData;
  }
}
