/**
 * @version 0.20
 *
 *
 * https://developers.stellar.org/docs/tutorials/send-and-receive-payments/
 * https://www.stellar.org/developers/js-stellar-sdk/reference/examples.html
 * https://www.stellar.org/developers/js-stellar-sdk/reference/
 *
 * wsl curl -X POST -F "tx=AAAAAgAAAACq+ux8eDBQfPoRzFjOTwHZKnFQjwRw0DSPL62mg02PjAAAAGQCA52cAAAAAQAAAAEAAAAAAAAAAAAAAABgF7+bAAAAAAAAAAEAAAAAAAAAAQAAAABUMjNVlZnxhC4rIKoE2qO/3QIFfy3nqF5/ObsdmmRWaAAAAAAAAAAABfXhAAAAAAAAAAABg02PjAAAAED6lRqsmOkqB8nRkI0tQTUSRAaHs/0mLuy6G58PvXzVQtlQiE2RPm9KC7Dv6c/a/0HS7F5mPXBFVshwtZS5WcgB" "https://horizon.stellar.org/transactions"
 *  {
 *   "type": "https://stellar.org/horizon-errors/transaction_failed",
 *   "title": "Transaction Failed",
 *   "status": 400,
 *   "detail": "The transaction failed when submitted to the stellar network. The `extras.result_codes` field on this response contains further details.  Descriptions of each code can be found at: https://www.stellar.org/developers/guides/concepts/list-of-operations.html",
 *   "extras": {
 *     "envelope_xdr": "AAAAAgAAAACq+ux8eDBQfPoRzFjOTwHZKnFQjwRw0DSPL62mg02PjAAAAGQCA52cAAAAAQAAAAEAAAAAAAAAAAAAAABgF7+bAAAAAAAAAAEAAAAAAAAAAQAAAABUMjNVlZnxhC4rIKoE2qO/3QIFfy3nqF5/ObsdmmRWaAAAAAAAAAAABfXhAAAAAAAAAAABg02PjAAAAED6lRqsmOkqB8nRkI0tQTUSRAaHs/0mLuy6G58PvXzVQtlQiE2RPm9KC7Dv6c/a/0HS7F5mPXBFVshwtZS5WcgB",
 *     "result_codes": {
 *       "transaction": "tx_too_late"
 *     },
 *     "result_xdr": "AAAAAAAAAGT////9AAAAAA=="
 *   }
 * }
 */
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import BlocksoftUtils from '../../common/AirDAOUtils';
// @ts-ignore
import MarketingEvent from '../../../app/services/Marketing/MarketingEvent';

import { XlmTxSendProvider } from './basic/XlmTxSendProvider';
import BlocksoftDispatcher from '@lib/BlocksoftDispatcher';
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

const FEE_DECIMALS = 7;

export default class XlmTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  private _settings: { network: string; currencyCode: string };
  private _provider: XlmTxSendProvider;

  constructor(settings: { network: string; currencyCode: string }) {
    this._settings = settings;
    this._provider = new XlmTxSendProvider();
  }

  needPrivateForFee(): boolean {
    return false;
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return false;
  }

  async checkTransferHasError(
    data: AirDAOBlockchainTypes.CheckTransferHasErrorData
  ): Promise<AirDAOBlockchainTypes.CheckTransferHasErrorResult> {
    // @ts-ignore
    if (data.amount && data.amount * 1 > 20) {
      return { isOk: true };
    }
    /**
     * @type {XlmScannerProcessor}
     */
    const balanceProvider = BlocksoftDispatcher.getScannerProcessor(
      this._settings.currencyCode
    );
    const balanceRaw = await balanceProvider.getBalanceBlockchain(
      data.addressTo
    );
    if (
      balanceRaw &&
      typeof balanceRaw.balance !== 'undefined' &&
      balanceRaw.balance > 1
    ) {
      return { isOk: true };
    } else {
      return { isOk: false, code: 'XLM', address: data.addressTo };
    }
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: {} = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const result: AirDAOBlockchainTypes.FeeRateResult = {
      selectedFeeIndex: -1,
      shouldShowFees: false
    } as AirDAOBlockchainTypes.FeeRateResult;

    // @ts-ignore
    if (data.amount * 1 <= 0) {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' XlmTransferProcessor.getFeeRate ' +
          data.addressFrom +
          ' => ' +
          data.addressTo +
          ' skipped as zero amount'
      );
      return result;
    }

    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' XlmTransferProcessor.getFeeRate ' +
        data.addressFrom +
        ' => ' +
        data.addressTo +
        ' started amount: ' +
        data.amount
    );

    const getFee = await this._provider.getFee();

    if (!getFee) {
      throw new Error('SERVER_RESPONSE_BAD_INTERNET');
    }
    // @ts-ignore
    const fee = BlocksoftUtils.toUnified(getFee, FEE_DECIMALS);

    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' XlmTransferProcessor.getFeeRate ' +
        data.addressFrom +
        ' => ' +
        data.addressTo +
        ' finished amount: ' +
        data.amount +
        ' fee: ' +
        fee
    );
    result.fees = [
      {
        langMsg: 'xrp_speed_one',
        feeForTx: fee.toString(),
        amountForTx: data.amount,
        blockchainData: getFee
      }
    ];
    result.selectedFeeIndex = 0;
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    const balance = data.amount;
    // @ts-ignore
    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' XlmTransferProcessor.getTransferAllBalance ' +
        data.addressFrom +
        ' => ' +
        balance
    );
    // noinspection EqualityComparisonWithCoercionJS
    if (BlocksoftUtils.diff(balance, 1) <= 0) {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -1,
        fees: [],
        shouldShowFees: false,
        countedForBasicBalance: '0'
      };
    }

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
    let newAmount = BlocksoftUtils.diff(
      result.fees[result.selectedFeeIndex].amountForTx,
      result.fees[result.selectedFeeIndex].feeForTx
    ).toString();
    newAmount = BlocksoftUtils.diff(newAmount, 1).toString();
    /*
        console.log(' ' + result.fees[result.selectedFeeIndex].amountForTx)
        console.log('--' + result.fees[result.selectedFeeIndex].feeForTx)
        console.log('=' + newAmount)
        */
    result.fees[result.selectedFeeIndex].amountForTx = newAmount;
    const tmp = {
      ...result,
      shouldShowFees: false,
      selectedTransferAllBalance:
        result.fees[result.selectedFeeIndex].amountForTx
    };
    // console.log('tmp', JSON.stringify(tmp))
    return tmp;
  }

  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    if (typeof privateData.privateKey === 'undefined') {
      throw new Error('XLM transaction required privateKey');
    }
    if (typeof data.addressTo === 'undefined') {
      throw new Error('XLM transaction required addressTo');
    }

    if (
      typeof uiData.selectedFee === 'undefined' ||
      typeof uiData.selectedFee.blockchainData === 'undefined'
    ) {
      const getFee = await this._provider.getFee();

      if (!getFee) {
        throw new Error('SERVER_RESPONSE_BAD_INTERNET');
      }
      if (typeof uiData.selectedFee === 'undefined') {
        // @ts-ignore
        uiData.selectedFee = {};
      }
      uiData.selectedFee.blockchainData = getFee;
    }

    let transaction = false;
    try {
      transaction = await this._provider.getPrepared(data, privateData, uiData);
    } catch (e: any) {
      if (e.message.indexOf('destination is invalid') !== -1) {
        throw new Error('SERVER_RESPONSE_BAD_DESTINATION');
      }
      throw e;
    }
    await AirDAOCryptoLog.log(
      this._settings.currencyCode + ' XlmTransferProcessor.sendTx prepared'
    );
    let raw = transaction.toEnvelope().toXDR('base64');
    await AirDAOCryptoLog.log(
      this._settings.currencyCode + ' XlmTransferProcessor.sendTx base64',
      raw
    );
    if (
      typeof uiData !== 'undefined' &&
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.rawOnly !== 'undefined' &&
      uiData.selectedFee.rawOnly
    ) {
      return { raw: uiData.selectedFee.raw };
    }

    let result = false;
    try {
      result = await this._provider.sendRaw(raw);
    } catch (e: any) {
      if (e.message.indexOf('op_no_destination') !== -1) {
        transaction = await this._provider.getPrepared(
          data,
          privateData,
          uiData,
          'create_account'
        );
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' XlmTransferProcessor.sendTx prepared create account'
        );
        raw = transaction.toEnvelope().toXDR('base64');
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' XlmTransferProcessor.sendTx base64 create account',
          raw
        );
        result = await this._provider.sendRaw(raw);
      } else {
        MarketingEvent.logOnlyRealTime(
          'v20_stellar_error ' +
            data.addressFrom +
            ' => ' +
            data.addressTo +
            ' ' +
            e.message,
          {
            raw
          }
        );
        if (e.message === 'op_underfunded') {
          throw new Error('SERVER_RESPONSE_NOTHING_TO_TRANSFER');
        } else {
          throw e;
        }
      }
    }
    if (!result || typeof result.hash === 'undefined') {
      MarketingEvent.logOnlyRealTime(
        'v20_stellar_no_result ' + data.addressFrom + ' => ' + data.addressTo,
        {
          raw
        }
      );
      throw new Error('SERVER_RESPONSE_NO_RESPONSE');
    }

    MarketingEvent.logOnlyRealTime(
      'v20_stellar_success_result ' +
        data.addressFrom +
        ' => ' +
        data.addressTo +
        ' ' +
        result.hash,
      {
        result
      }
    );

    return { transactionHash: result.hash };
  }
}