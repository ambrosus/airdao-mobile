/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @author Ksu
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '../../blockchains/AirDAOBlockchainTypes';
import BlocksoftPrivateKeysUtils from '../../common/AirDAOPrivateKeysUtils';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';

export namespace BlocksoftTransferPrivate {
  const CACHE_PRIVATE: any = {};

  const initTransferPrivateBTC = async function (
    data: AirDAOBlockchainTypes.TransferData,
    mnemonic: string
  ): Promise<AirDAOBlockchainTypes.TransferPrivateData> {
    const privateData = {
      privateKey: mnemonic
    } as AirDAOBlockchainTypes.TransferPrivateData;
    return privateData;
  };
  export const initTransferPrivate = async function (
    data: AirDAOBlockchainTypes.TransferData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData
  ): Promise<AirDAOBlockchainTypes.TransferPrivateData> {
    const privateData = {} as AirDAOBlockchainTypes.TransferPrivateData;
    let mnemonic =
      typeof additionalData !== 'undefined' &&
      typeof additionalData.mnemonic !== 'undefined'
        ? additionalData.mnemonic
        : CACHE_PRIVATE[data.walletHash];
    if (!mnemonic) {
      mnemonic = await AirDAOKeysStorage.getWalletMnemonic(
        data.walletHash,
        'initTransferPrivate'
      );
      CACHE_PRIVATE[data.walletHash] = mnemonic;
    }
    if (!mnemonic) {
      throw new Error('no mnemonic for hash ' + data.walletHash);
    }
    if (
      data.currencyCode === 'BTC' ||
      data.currencyCode === 'LTC' ||
      data.currencyCode === 'USDT'
    ) {
      return initTransferPrivateBTC(data, mnemonic);
    }
    const discoverFor = {
      mnemonic,
      addressToCheck: data.addressFrom,
      walletHash: data.walletHash,
      derivationPath: data.derivationPath,
      currencyCode: data.currencyCode
    };
    const result = await BlocksoftPrivateKeysUtils.getPrivateKey(
      discoverFor,
      'initTransferPrivate'
    );
    // @ts-ignore
    privateData.privateKey = result.privateKey;
    // @ts-ignore
    privateData.addedData = result.addedData;
    AirDAOCryptoLog.log(
      `${data.currencyCode} BlocksoftTransferPrivate.initTransferPrivate finished for ${data.addressFrom}`
    );
    return privateData;
  };
}
