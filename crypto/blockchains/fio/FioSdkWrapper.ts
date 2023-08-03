/**
 * @version 0.77
 */
// @ts-ignore
import { FIOSDK } from '@fioprotocol/fiosdk';

import BlocksoftKeysStorage from '@crypto/actions/BlocksoftKeysStorage/BlocksoftKeysStorage';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';

const fetchJson = async (uri, opts = {}) => {
  // eslint-disable-next-line no-undef
  return fetch(uri, opts);
};

export class FioSdkWrapper {
  sdk;
  walletHash = false;
  async init(walletHash, source) {
    if (this.walletHash === walletHash) return false;
    try {
      const res = await BlocksoftKeysStorage.getAddressCache(
        walletHash + 'SpecialFio'
      );
      let publicKey, fioKey;
      if (res) {
        publicKey = res.address;
        fioKey = res.privateKey;
      } else {
        const mnemonic = await BlocksoftKeysStorage.getWalletMnemonic(
          walletHash,
          source + ' setSelectedWallet init for Fio'
        );
        let tmp = await FIOSDK.createPrivateKeyMnemonic(mnemonic);
        fioKey = tmp.fioKey;
        tmp = FIOSDK.derivedPublicKey(fioKey);
        publicKey = tmp.publicKey;
        await BlocksoftKeysStorage.setAddressCache(walletHash + 'SpecialFio', {
          address: publicKey,
          privateKey: fioKey
        });
      }
      const link = BlocksoftExternalSettings.getStatic('FIO_BASE_URL');
      this.sdk = new FIOSDK(fioKey, publicKey, link, fetchJson);
      this.walletHash = walletHash;
      AirDAOCryptoLog.log(`FioSdkWrapper.inited for ${walletHash}`);
    } catch (e) {}
    return true;
  }
}

export const fioSdkWrapper = new FioSdkWrapper();

export const getFioSdk = () => {
  if (typeof fioSdkWrapper?.sdk !== 'undefined' && fioSdkWrapper?.sdk) {
    return fioSdkWrapper?.sdk;
  }
  const link = BlocksoftExternalSettings.getStatic('FIO_BASE_URL');
  return new FIOSDK(null, null, link, fetchJson);
};
