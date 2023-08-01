/**
 * @version 0.5
 */
import { crypto, base58Encode } from '@waves/ts-lib-crypto';

interface SuperPrivateData {
  mnemonic: string;
}

export default class WavesAddressProcessor {
  async setBasicRoot(root: any): Promise<void> {
    // Implement the setBasicRoot method according to its functionality.
    // Since the original function doesn't have any implementation, I'm leaving this empty.
  }

  /**
   * @param {string|Buffer} _privateKey
   * @param {any} data
   * @param {SuperPrivateData} superPrivateData
   * @returns {Promise<{privateKey: string, address: string, addedData: any}>}
   */
  async getAddress(
    _privateKey: string | Buffer,
    data: any = {},
    superPrivateData: SuperPrivateData
  ): Promise<{ privateKey: string; address: string; addedData: any }> {
    const all = crypto({ seed: superPrivateData.mnemonic });
    const buff1 = all.address();
    const address = base58Encode(buff1);
    const key2 = all.keyPair();
    const pubKey = base58Encode(key2.publicKey);
    const privKey = base58Encode(key2.privateKey);
    return { address, privateKey: privKey, addedData: { pubKey } };
  }
}
