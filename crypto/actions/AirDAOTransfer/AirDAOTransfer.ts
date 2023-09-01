/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @author Ksu
 * @version 0.20
 */
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import { AirDAOBlockchainTypes } from '../../blockchains/AirDAOBlockchainTypes';
import { AirDAOTransferDispatcher } from '../../blockchains/AirDAOTransferDispatcher';
import { AirDAOTransferPrivate } from './AirDAOTransferPrivate';
import { AirDAODictTypes } from '../../common/AirDAODictTypes';

import CoinAirDAODict from '@crypto/assets/coinAirDAODict.json';

type DataCache = {
  [key in AirDAODictTypes.Code]: {
    key: string;
    memo: string | boolean;
    time: number;
  };
};

const CACHE_DOUBLE_TO: DataCache = {} as DataCache;
const CACHE_VALID_TIME = 120000; // 2 minute
const CACHE_DOUBLE_BSE = {};

export namespace AirDAOTransfer {
  export const getTransferAllBalance = async function (
    data: AirDAOBlockchainTypes.TransferData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    if (typeof data.derivationPath !== 'undefined' && data.derivationPath) {
      data.derivationPath = data.derivationPath.replace(/quote/g, "'");
    }
    data.isTransferAll = true;
    let transferAllCount;
    try {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.getTransferAllBalance started ${data.addressFrom} `
      );
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      const additionalDataTmp = { ...additionalData };
      let privateData = {} as AirDAOBlockchainTypes.TransferPrivateData;
      if (processor.needPrivateForFee()) {
        privateData = await AirDAOTransferPrivate.initTransferPrivate(
          data,
          additionalData
        );
      }
      additionalDataTmp.mnemonic = '***';
      transferAllCount = await AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      ).getTransferAllBalance(data, privateData, additionalDataTmp);

      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.getTransferAllBalance got ${data.addressFrom} result is ok`
      );
    } catch (e) {
      if (
        e.message.indexOf('SERVER_RESPONSE_') === -1 &&
        e.message.indexOf('UI_') === -1
      ) {
        // noinspection ES6MissingAwait
        AirDAOCryptoLog.err(
          `${data.currencyCode} AirDAOTransfer.getTransferAllBalance ` +
            e.message
        );
        throw new Error(
          'server.not.responding.all.balance.' +
            data.currencyCode +
            ' ' +
            e.message
        );
      } else {
        throw e;
      }
    }
    return transferAllCount;
  };

  export const getFeeRate = async function (
    data: AirDAOBlockchainTypes.TransferData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const lower = data.addressTo.toLowerCase();
    if (!data?.walletConnectData?.data) {
      for (const key in CoinAirDAODict) {
        const tmp = CoinAirDAODict[key];
        if (
          typeof tmp.canBeDestination !== 'undefined' &&
          tmp.canBeDestination
        ) {
          continue;
        }
        if (tmp?.tokenName && tmp?.tokenName.toLowerCase() === lower) {
          throw new Error('SERVER_RESPONSE_CONTRACT_DESTINATION_INVALID');
        }
        if (tmp?.tokenAddress && tmp?.tokenAddress.toLowerCase() === lower) {
          throw new Error('SERVER_RESPONSE_CONTRACT_DESTINATION_INVALID');
        }
      }
    }

    if (typeof data.derivationPath === 'undefined' || !data.derivationPath) {
      throw new Error(
        'AirDAOTransfer.getFeeRate requires derivationPath ' +
          JSON.stringify(data)
      );
    }
    data.derivationPath = data.derivationPath.replace(/quote/g, "'");
    let feesCount;
    try {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.getFeeRate started ${data.addressFrom} `
      );
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      const additionalDataTmp = { ...additionalData };

      let privateData = {} as AirDAOBlockchainTypes.TransferPrivateData;
      if (processor.needPrivateForFee()) {
        privateData = await AirDAOTransferPrivate.initTransferPrivate(
          data,
          additionalData
        );
      }
      additionalDataTmp.mnemonic = '***';
      feesCount = await processor.getFeeRate(
        data,
        privateData,
        additionalDataTmp
      );
      feesCount.countedTime = new Date().getTime();
    } catch (e) {
      if (typeof e.message === 'undefined') {
        await AirDAOCryptoLog.log('AirDAOTransfer.getFeeRate strange error');
      } else if (
        e.message.indexOf('SERVER_RESPONSE_') === -1 &&
        e.message.indexOf('UI_') === -1
      ) {
        // noinspection ES6MissingAwait
        await AirDAOCryptoLog.err(
          `${data.currencyCode} AirDAOTransfer.getFeeRate error ` +
            data.addressFrom +
            ' => ' +
            data.addressTo +
            ' ' +
            data.amount +
            ' ' +
            e.message
        );
        throw new Error(
          'server.not.responding.network.prices.' +
            data.currencyCode +
            ' ' +
            e.message
        );
      } else {
        await AirDAOCryptoLog.log(
          'AirDAOTransfer.getFeeRate inner error ' + e.message
        );
        throw e;
      }
    }
    return feesCount;
  };

  export const sendTx = async (
    data: AirDAOBlockchainTypes.TransferData,
    uiData: AirDAOBlockchainTypes.TransferUiData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> => {
    const lower = data.addressTo.toLowerCase();
    if (!data?.walletConnectData?.data) {
      for (const key in CoinAirDAODict) {
        const tmp = CoinAirDAODict[key];
        if (
          typeof tmp.canBeDestination !== 'undefined' &&
          tmp.canBeDestination
        ) {
          continue;
        }
        if (tmp?.tokenName && tmp?.tokenName.toLowerCase() === lower) {
          throw new Error('SERVER_RESPONSE_CONTRACT_DESTINATION_INVALID');
        }
        if (tmp?.tokenAddress && tmp?.tokenAddress.toLowerCase() === lower) {
          throw new Error('SERVER_RESPONSE_CONTRACT_DESTINATION_INVALID');
        }
      }
    }

    data.derivationPath = data.derivationPath.replace(/quote/g, "'");

    const bseOrderId =
      typeof uiData !== 'undefined' &&
      uiData &&
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.bseOrderId !== 'undefined'
        ? uiData.selectedFee.bseOrderId
        : false;
    const uiErrorConfirmed =
      typeof uiData !== 'undefined' &&
      uiData &&
      typeof uiData.uiErrorConfirmed !== 'undefined' &&
      uiData.uiErrorConfirmed;
    const memo =
      typeof data !== 'undefined' && data && typeof data.memo !== 'undefined'
        ? data.memo
        : false;

    try {
      if (
        data.transactionReplaceByFee ||
        data.transactionRemoveByFee ||
        data.transactionSpeedUp
      ) {
        // do nothing
      } else {
        if (bseOrderId) {
          // bse order
          if (typeof CACHE_DOUBLE_BSE[bseOrderId] !== 'undefined') {
            if (!uiErrorConfirmed) {
              throw new Error('UI_CONFIRM_DOUBLE_BSE_SEND');
            }
          }
        }
        // usual tx
        if (typeof CACHE_DOUBLE_TO[data.currencyCode] !== 'undefined') {
          if (!uiErrorConfirmed) {
            if (
              data.addressTo &&
              CACHE_DOUBLE_TO[data.currencyCode].key === data.addressTo &&
              CACHE_DOUBLE_TO[data.currencyCode].memo === memo
            ) {
              const time = new Date().getTime();
              const diff = time - CACHE_DOUBLE_TO[data.currencyCode].time;
              if (diff < CACHE_VALID_TIME) {
                CACHE_DOUBLE_TO[data.currencyCode].time = time;
                throw new Error('UI_CONFIRM_DOUBLE_SEND');
              }
            }
          }
        }
      }
    } catch (e: any) {
      if (
        e.message.indexOf('SERVER_RESPONSE_') === -1 &&
        e.message.indexOf('UI_') === -1
      ) {
        AirDAOCryptoLog.log(
          `${data.currencyCode} AirDAOTransfer.sendTx error ` + e.message
        );
      }
      throw e;
    }

    let txResult;
    try {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.sendTx started ${data.addressFrom} `
      );
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      const privateData = await AirDAOTransferPrivate.initTransferPrivate(
        data,
        additionalData
      );
      txResult = await processor.sendTx(data, privateData, uiData);
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.sendTx got ${data.addressFrom} result is ok`
      );
      if (
        typeof uiData === 'undefined' ||
        typeof uiData.selectedFee === 'undefined' ||
        typeof uiData.selectedFee.rawOnly === 'undefined' ||
        !uiData.selectedFee.rawOnly
      ) {
        CACHE_DOUBLE_TO[data.currencyCode] = {
          key: data.addressTo,
          memo,
          time: new Date().getTime()
        };
      }
      if (bseOrderId) {
        CACHE_DOUBLE_BSE[bseOrderId] = true;
      }
      // if (typeof uiData.selectedFee !== 'undefined')
    } catch (e: any) {
      if (
        e.message.indexOf('SERVER_RESPONSE_') === -1 &&
        e.message.indexOf('UI_') === -1 &&
        e.message.indexOf('connect() timed') === -1
      ) {
        // noinspection ES6MissingAwait
        AirDAOCryptoLog.err(
          `${data.currencyCode} AirDAOTransfer.sendTx ` + e.message
        );
      }

      if (
        e.message.indexOf('imeout') !== -1 ||
        e.message.indexOf('network error') !== -1 ||
        e.message === 'SERVER_RESPONSE_BAD_INTERNET'
      ) {
        throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
      }
      if (
        e.message.indexOf('SERVER_RESPONSE_NOT_CONNECTED') !== -1 &&
        (data.currencyCode === 'TRX' ||
          data.currencyCode.indexOf('TRX_') !== -1)
      ) {
        AirDAOCryptoLog.log(
          `${data.currencyCode} AirDAOTransfer.sendTx ` + e.message
        );
      } else {
        throw e;
      }
    }
    return txResult;
  };

  export const sendRawTx = async function (
    data: AirDAOBlockchainTypes.DbAccount,
    rawTxHex: string,
    txRBF: any,
    logData: any
  ): Promise<string> {
    let txResult = '';
    try {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.sendRawTx started ${data.address} `
      );
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      if (typeof processor.sendRawTx === 'undefined') {
        return 'none';
      }
      txResult = await processor.sendRawTx(data, rawTxHex, txRBF, logData);
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.sendRawTx got ${data.address} result is ok`
      );
    } catch (e) {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.sendRawTx error ` + e.message
      );
      throw e;
    }
    return txResult;
  };

  export const setMissingTx = async function (
    data: AirDAOBlockchainTypes.DbAccount,
    dbTransaction: AirDAOBlockchainTypes.DbTransaction
  ): Promise<boolean> {
    let txResult = false;
    try {
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.setMissing started ${data.address} `
      );
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      if (typeof processor.setMissingTx === 'undefined') {
        return false;
      }
      txResult = await processor.setMissingTx(data, dbTransaction);
      AirDAOCryptoLog.log(
        `${data.currencyCode} AirDAOTransfer.setMissing got ${data.address} result is ok`
      );
    } catch (e) {
      AirDAOCryptoLog.err(
        `${data.currencyCode} AirDAOTransfer.setMissing error ` + e.message
      );
    }
    return txResult;
  };

  export const canRBF = function (
    data: AirDAOBlockchainTypes.DbAccount,
    dbTransaction: AirDAOBlockchainTypes.DbTransaction,
    source: string
  ): boolean {
    let txResult = false;
    try {
      // AirDAOCryptoLog.log(`AirDAOTransfer.canRBF ${data.currencyCode} from ${source} started ${data.address} `)
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        typeof data.currencyCode !== 'undefined'
          ? data.currencyCode
          : dbTransaction.currencyCode
      );
      if (typeof processor.canRBF === 'undefined') {
        return false;
      }
      txResult = processor.canRBF(data, dbTransaction, source);
      // AirDAOCryptoLog.log(`AirDAOTransfer.canRBF ${data.currencyCode} from ${source} got ${data.address} result is ${JSON.stringify(txResult)}`)
    } catch (e) {
      AirDAOCryptoLog.err(
        `${data.currencyCode} AirDAOTransfer.canRBF error from ${source} ` +
          e.message
      );
    }
    return txResult;
  };

  export const checkSendAllModal = function (data: { currencyCode: any }) {
    let checkSendAllModalResult = false;
    try {
      // AirDAOCryptoLog.log(`AirDAOTransfer.checkSendAllModal ${data.currencyCode} started `)
      const processor = AirDAOTransferDispatcher.getTransferProcessor(
        data.currencyCode
      );
      if (typeof processor.checkSendAllModal === 'undefined') {
        return false;
      }
      checkSendAllModalResult = processor.checkSendAllModal(data);
      // AirDAOCryptoLog.log(`AirDAOTransfer.checkSendAllModal ${data.currencyCode} got result is ok ` + JSON.stringify(checkSendAllModalResult))
    } catch (e) {
      AirDAOCryptoLog.err(
        `${data.currencyCode} AirDAOTransfer.checkSendAllModal error ` +
          e.message
      );
    }
    return checkSendAllModalResult;
  };
}
