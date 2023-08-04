/**
 * @version 0.20
 */
import BlocksoftCryptoLog from '../../common/BlocksoftCryptoLog';
import MoneroUtilsParser from './ext/MoneroUtilsParser';
import XmrSendProvider from './providers/XmrSendProvider';
import XmrUnspentsProvider from './providers/XmrUnspentsProvider';
import config from '@constants/config';
import BlocksoftPrettyNumbers from '@crypto/common/AirDAOPrettyNumbers';
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

type ModifiedSendTxResult = {
  rawOnly: boolean;
  raw: any;
};

export default class XmrTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  private sendProvider: XmrSendProvider;
  private unspentsProvider: XmrUnspentsProvider;
  private _settings: any;

  constructor(settings: any) {
    this._settings = settings;
    this.sendProvider = new XmrSendProvider(settings);
    this.unspentsProvider = new XmrUnspentsProvider(settings);
  }

  needPrivateForFee(): boolean {
    return true;
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return true;
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const result: AirDAOBlockchainTypes.FeeRateResult = {
      selectedFeeIndex: -1
    } as AirDAOBlockchainTypes.FeeRateResult;

    // @ts-ignore
    if (data.amount * 1 <= 0) {
      BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' XmrTransferProcessor.getFeeRate ' +
          data.addressFrom +
          ' => ' +
          data.addressTo +
          ' skipped as zero amount'
      );
      return result;
    }

    if (
      typeof data.accountJson === 'undefined' ||
      !data.accountJson ||
      typeof data.accountJson.publicSpendKey === 'undefined'
    ) {
      throw new Error('XmrTransferProcessor public spend key is required');
    }
    const keys = privateData.privateKey.split('_');
    const privSpendKey = keys[0];
    const privViewKey = keys[1];
    const pubSpendKey = data.accountJson.publicSpendKey;

    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' XmrTransferProcessor.getFeeRate  newSender ' +
        data.addressFrom +
        ' => ' +
        data.addressTo +
        ' started amount: ' +
        data.amount
    );

    const apiClient = this.unspentsProvider;

    let core = await MoneroUtilsParser.getCore();
    if (!core || typeof core === 'undefined') {
      core = await MoneroUtilsParser.getCore();
    }

    result.fees = [];

    const logFees = [];
    let noBalanceError = false;
    apiClient.init();

    const unspentOuts = await apiClient._getUnspents(
      {
        address: data.addressFrom,
        view_key: privViewKey,
        amount: '0',
        app_name: 'MyMonero',
        app_version: '1.3.2',
        dust_threshold: '2000000000',
        mixin: 15,
        use_dust: true
      },
      // @ts-ignore
      false
    );

    for (let i = 1; i <= 4; i++) {
      try {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' XmrTransferProcessor.getFeeRate ' +
            data.addressFrom +
            ' => ' +
            data.addressTo +
            ' start amount: ' +
            data.amount +
            ' fee ' +
            i
        );

        const fee = await core.createTransaction({
          destinations: [
            {
              to_address: data.addressTo,
              // @ts-ignore
              send_amount: data.isTransferAll
                ? 0
                : BlocksoftPrettyNumbers.setCurrencyCode('XMR').makePretty(
                    data.amount
                  )
            }
          ],
          shouldSweep: data.isTransferAll,
          address: data.addressFrom,
          privateViewKey: privViewKey,
          privateSpendKey: privSpendKey,
          publicSpendKey: pubSpendKey,
          priority: i,
          nettype: 'MAINNET',
          unspentOuts,
          // @ts-ignore
          randomOutsCb: (numberOfOuts: number) => {
            const amounts = [];
            // tslint:disable-next-line:no-shadowed-variable
            for (let i = 0; i < numberOfOuts; i++) {
              amounts.push('0');
            }
            return apiClient._getRandomOutputs({
              amounts,
              app_name: 'MyMonero',
              app_version: '1.3.2',
              count: 16
            });
          }
        });

        if (typeof fee !== 'undefined' && fee && typeof fee.used_fee) {
          const tmp = {
            langMsg: 'xmr_speed_' + i,
            feeForTx: fee.used_fee,
            blockchainData: {
              secretTxKey: fee.tx_key,
              rawTxHex: fee.serialized_signed_tx,
              rawTxHash: fee.tx_hash,
              usingOuts: fee.using_outs,
              simplePriority: i
            }
          } as AirDAOBlockchainTypes.Fee;

          const logTmp = {
            langMsg: 'xmr_speed_' + i,
            feeForTx: fee.used_fee,
            blockchainData: {
              secretTxKey: fee.tx_key,
              rawTxHash: fee.tx_hash,
              usingOuts: fee.using_outs,
              simplePriority: i
            },
            amountForTx: '?'
          };
          if (typeof fee.using_amount !== 'undefined') {
            tmp.amountForTx = fee.using_amount;
            logTmp.amountForTx = fee.using_amount;
          } else {
            tmp.amountForTx = data.amount;
            logTmp.amountForTx = data.amount;
          }
          tmp.addressToTx = data.addressTo;
          result.fees.push(tmp);
          logFees.push(logTmp);
        }
      } catch (e: any) {
        if (e.message.indexOf('pendable balance too low') !== -1) {
          // do nothing
          noBalanceError = true;
          break;
        } else {
          if (config.debug.cryptoErrors) {
            console.log('XmrTransferProcessor error ', e);
          }
          if (
            e.message.indexOf(
              'An error occurred while getting decoy outputs'
            ) !== -1
          ) {
            BlocksoftCryptoLog.log(
              this._settings.currencyCode +
                ' XmrTransferProcessor error will go out bad decoy'
            );
            throw new Error('SERVER_RESPONSE_BAD_CODE');
          } else if (e.message.indexOf('decode address') !== -1) {
            BlocksoftCryptoLog.log(
              this._settings.currencyCode +
                ' XmrTransferProcessor error will go out'
            );
            throw new Error('SERVER_RESPONSE_BAD_DESTINATION');
          } else if (e.message.indexOf('Not enough spendables') !== -1) {
            BlocksoftCryptoLog.log(
              this._settings.currencyCode +
                ' XmrTransferProcessor error not enough'
            );
            throw new Error('SERVER_RESPONSE_NO_RESPONSE_XMR');
          } else {
            BlocksoftCryptoLog.err(
              this._settings.currencyCode +
                ' XmrTransferProcessor.getFeeRate ' +
                data.addressFrom +
                ' => ' +
                data.addressTo +
                ' finished amount: ' +
                data.amount +
                ' error fee ' +
                i +
                ': ' +
                e.message
            );
            throw e;
          }
        }
      }
    }

    if (result.fees.length === 0 && noBalanceError) {
      throw new Error('SERVER_RESPONSE_NO_RESPONSE_XMR');
    }

    // @ts-ignore
    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        `' XmrTransferProcessor.getFeeRate ' +
        ${data.addressFrom} +
        ' => ' +
        ${data.addressTo} +
        ' finished amount: ' +
      ${data.amount} +
        ' fee: ',
      ${logFees}`
    );

    if (result.fees.length < 3) {
      result.selectedFeeIndex = result.fees.length - 1;
    } else {
      result.selectedFeeIndex = 2;
    }
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    const balance = data.amount;

    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        `' XmrTransferProcessor.getTransferAllBalance ',
      ${data.addressFrom + ' => ' + balance}`
    );

    data.isTransferAll = true;
    const result = await this.getFeeRate(data, privateData, additionalData);
    // @ts-ignore
    if (!result || result.selectedFeeIndex < 0) {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -2,
        fees: [],
        shouldShowFees: false,
        countedForBasicBalance: balance
      };
    }
    // @ts-ignore
    return {
      ...result,
      shouldShowFees: false,
      selectedTransferAllBalance:
        result.fees[result.selectedFeeIndex].amountForTx,
      countedForBasicBalance: balance
    };
  }

  // @ts-ignore
  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult | ModifiedSendTxResult> {
    if (typeof privateData.privateKey === 'undefined') {
      throw new Error('XMR transaction required privateKey');
    }
    if (typeof data.addressTo === 'undefined') {
      throw new Error('XMR transaction required addressTo');
    }

    if (typeof uiData.selectedFee === 'undefined') {
      throw new Error('XMR transaction required selectedFee');
    }

    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        `' XmrTransferProcessor.sendTx started ' +
        ${data.addressFrom} +
        '=>' +
        ${data.addressTo} +
        ' fee',
      ${uiData.selectedFee}`
    );
    let foundFee = uiData?.selectedFee;
    if (data.addressTo !== uiData.selectedFee.addressToTx) {
      try {
        BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' XmrTransferProcessor.sendTx rechecked ' +
            data.addressFrom +
            '=>' +
            data.addressTo +
            ' fee rebuild start as got tx to ' +
            uiData.selectedFee.addressToTx
        );
        const newSelectedFee = await this.getFeeRate(data, privateData);
        if (
          typeof newSelectedFee.fees === 'undefined' ||
          !newSelectedFee.fees
        ) {
          throw new Error('no fees');
        }
        foundFee = newSelectedFee.fees[newSelectedFee.selectedFeeIndex];
        for (const fee of newSelectedFee.fees) {
          if (fee.langMsg === uiData.selectedFee.langMsg) {
            foundFee = fee;
          }
        }
        BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            `' XmrTransferProcessor.sendTx rechecked ' +
            ${data.addressFrom} +
            '=>' +
            ${data.addressTo} +
            ' found fee',
          ${foundFee}`
        );
      } catch (e: any) {
        BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' XmrTransferProcessor.sendTx rechecked ' +
            data.addressFrom +
            '=>' +
            data.addressTo +
            ' fee rebuild error ' +
            e.message
        );
        throw new Error('XMR transaction invalid output - please try again');
      }
    }
    const rawTxHex = foundFee?.blockchainData?.rawTxHex;
    const rawTxHash = foundFee?.blockchainData?.rawTxHash;
    const secretTxKey = foundFee?.blockchainData?.secretTxKey;
    const usingOuts = foundFee?.blockchainData?.usingOuts;

    const keys = privateData.privateKey.split('_');
    const privViewKey = keys[1];

    if (typeof rawTxHex === 'undefined') {
      throw new Error('SERVER_RESPONSE_NO_RESPONSE_XMR');
    }

    if (
      typeof uiData !== 'undefined' &&
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.rawOnly !== 'undefined' &&
      uiData.selectedFee.rawOnly
    ) {
      // TODO fix this ts error
      return { rawOnly: uiData.selectedFee.rawOnly, raw: rawTxHex };
    }

    const send = {
      address: data.addressFrom,
      tx: rawTxHex,
      privViewKey,
      usingOuts,
      unspentsProvider: this.unspentsProvider
    };

    // @ts-ignore
    BlocksoftCryptoLog.log(
      `${this._settings.currencyCode} + ' XmrTransferProcessor.sendTx result',
      ${send}`
    );

    // @ts-ignore
    if (send.status === 'OK') {
      return { transactionHash: rawTxHash, transactionJson: { secretTxKey } };
    } else {
      throw new Error(
        this._settings.currencyCode +
          ' XmrTransferProcessor.sendTx status error ' +
          JSON.stringify(send)
      );
    }
  }
}
