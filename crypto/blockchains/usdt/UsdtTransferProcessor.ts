/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import BtcUnspentsProvider from '../btc/providers/BtcUnspentsProvider';
import DogeSendProvider from '../doge/providers/DogeSendProvider';
import UsdtTxInputsOutputs from './tx/UsdtTxInputsOutputs';
import UsdtTxBuilder from './tx/UsdtTxBuilder';
import BtcNetworkPrices from '../btc/basic/BtcNetworkPrices';
import BtcTransferProcessor from '../btc/BtcTransferProcessor';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
// @ts-ignore
import DaemonCache from '../../../app/daemons/DaemonCache';

export default class UsdtTransferProcessor
  extends BtcTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  _trezorServerCode = 'BTC_TREZOR_SERVER';

  _builderSettings: AirDAOBlockchainTypes.BuilderSettings = {
    minOutputDustReadable: 0.000001,
    minChangeDustReadable: 0.000001,
    feeMaxForByteSatoshi: 1000, // for tx builder
    feeMaxAutoReadable2: 0.01, // for fee calc,
    feeMaxAutoReadable6: 0.005, // for fee calc
    feeMaxAutoReadable12: 0.001, // for fee calc
    changeTogether: false,
    minRbfStepSatoshi: 50,
    minSpeedUpMulti: 1.5
  };

  _initProviders() {
    if (this._initedProviders) return false;
    this.unspentsProvider = new BtcUnspentsProvider(
      this._settings,
      this._trezorServerCode
    );
    this.sendProvider = new DogeSendProvider(
      this._settings,
      this._trezorServerCode
    );
    this.txPrepareInputsOutputs = new UsdtTxInputsOutputs(
      this._settings,
      this._builderSettings
    );
    this.txBuilder = new UsdtTxBuilder(this._settings, this._builderSettings);
    this.networkPrices = new BtcNetworkPrices();
    this._initedProviders = true;
  }

  async checkTransferHasError(
    data: AirDAOBlockchainTypes.CheckTransferHasErrorData
  ): Promise<AirDAOBlockchainTypes.CheckTransferHasErrorResult> {
    // @ts-ignore
    const tmp = await DaemonCache.getCacheAccount(data.walletHash, 'BTC');
    if (tmp.balance * 1 > 0) {
      return { isOk: true };
    } else {
      return {
        isOk: false,
        code: 'TOKEN',
        parentBlockchain: 'Bitcoin',
        parentCurrency: 'BTC'
      };
    }
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return true;
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const tmpData = { ...data };
    tmpData.isTransferAll = false;
    // @ts-ignore
    AirDAOCryptoLog.log(
      this._settings.currencyCode + ' UsdtTxProcessor.getFeeRate started'
    );
    const result = await super.getFeeRate(tmpData, privateData, additionalData);
    for (const fee of result.fees) {
      fee.amountForTx = data.amount;
    }
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
        ` UsdtTransferProcessor.getTransferAllBalance
      ${data.addressFrom + ' => ' + balance}`
    );
    // noinspection EqualityComparisonWithCoercionJS
    if (balance === '0') {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -1,
        fees: [],
        countedForBasicBalance: '0',
        countedTime: new Date().getTime()
      };
    }
    const fees = await this.getFeeRate(data, privateData, additionalData);
    if (!fees || fees.selectedFeeIndex < 0) {
      return {
        selectedTransferAllBalance: balance,
        selectedFeeIndex: -2,
        fees: [],
        countedForBasicBalance: balance,
        countedTime: new Date().getTime()
      };
    }
    return {
      ...fees,
      selectedTransferAllBalance: balance
    };
  }

  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    const result = await super.sendTx(data, privateData, uiData);
    result.transactionFeeCurrencyCode = 'BTC';
    return result;
  }
}