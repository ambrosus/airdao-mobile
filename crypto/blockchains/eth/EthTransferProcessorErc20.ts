/**
 * @author Ksu
 * @version 0.20
 */
import EthTransferProcessor from './EthTransferProcessor';
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';

import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

import abi from './ext/erc20.js';

export default class EthTransferProcessorErc20
  extends EthTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  constructor(settings: { network?: string; tokenAddress: any }) {
    super(settings);
    // @ts-ignore
    this._token = new this._web3.eth.Contract(abi.ERC20, settings.tokenAddress);
    this._tokenAddress = settings.tokenAddress.toLowerCase();
    this._useThisBalance = false;
  }

  _token: any = false;
  _tokenAddress = '';
  _useThisBalance = false;

  async checkTransferHasError(
    data: AirDAOBlockchainTypes.CheckTransferHasErrorData
  ): Promise<AirDAOBlockchainTypes.CheckTransferHasErrorResult> {
    // @ts-ignore
    const balance =
      data.addressFrom && data.addressFrom !== ''
        ? await this._web3.eth.getBalance(data.addressFrom)
        : 0;
    if (balance > 0) {
      return { isOk: true };
    } else {
      // @ts-ignore
      return {
        isOk: false,
        code: 'TOKEN',
        parentBlockchain: this._mainTokenBlockchain,
        parentCurrency: this._mainCurrencyCode
      };
    }
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return false;
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    if (this.checkWeb3CurrentServerUpdated()) {
      this._token = new this._web3.eth.Contract(
        abi.ERC20,
        this._settings.tokenAddress
      );
    }

    if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
      return super.getFeeRate(data, privateData, additionalData);
    }

    const tmpData = { ...data };
    if (
      typeof data.transactionRemoveByFee !== 'undefined' &&
      data.transactionRemoveByFee
    ) {
      tmpData.amount = '0';
      return super.getFeeRate(tmpData, privateData, additionalData);
    }
    let estimatedGas;

    try {
      const basicAddressTo = data.addressTo.toLowerCase();
      let firstAddressTo = basicAddressTo;
      let eventTitle =
        'v20_' + this._mainCurrencyCode.toLowerCase() + '_gas_limit_token1 ';
      if (basicAddressTo === data.addressFrom.toLowerCase()) {
        const tmp1 = '0xA09fe17Cb49D7c8A7858C8F9fCac954f82a9f487';
        const tmp2 = '0xf1Cff704c6E6ce459e3E1544a9533cCcBDAD7B99';
        firstAddressTo = data.addressFrom === tmp1 ? tmp2 : tmp1;
        eventTitle =
          'v20_' + this._mainCurrencyCode.toLowerCase() + '_gas_limit_token2 ';
      }

      let serverEstimatedGas = 0;
      let serverEstimatedGas2 = 0;
      let serverEstimatedGas3 = 0;
      try {
        serverEstimatedGas = await this._token.methods
          .transfer(firstAddressTo, data.amount)
          .estimateGas({ from: data.addressFrom });
      } catch (e) {
        e.message +=
          ' while transfer check1 ' +
          data.amount +
          ' firstAddressTo ' +
          firstAddressTo +
          ' from ' +
          data.addressFrom;
      }
      try {
        serverEstimatedGas2 = await this._token.methods
          .transfer(basicAddressTo, data.amount)
          .estimateGas({ from: data.addressFrom });
      } catch (e) {
        e.message +=
          ' while transfer check2 ' +
          data.amount +
          ' basicAddressTo ' +
          firstAddressTo +
          ' from ' +
          data.addressFrom;
      }
      // @ts-ignore
      const tmp3 = data.amount * 1;
      try {
        serverEstimatedGas3 = await this._token.methods
          .transfer(basicAddressTo, tmp3)
          .estimateGas({ from: data.addressFrom });
      } catch (e) {
        e.message +=
          ' while transfer check3 ' +
          tmp3 +
          ' basicAddressTo ' +
          firstAddressTo +
          ' from ' +
          data.addressFrom;
      }

      if (serverEstimatedGas2 > serverEstimatedGas) {
        estimatedGas = serverEstimatedGas2;
      } else {
        estimatedGas = serverEstimatedGas;
      }
      if (estimatedGas < serverEstimatedGas3) {
        estimatedGas = serverEstimatedGas3;
      }

      let minGas = BlocksoftExternalSettings.getStatic(
        this._settings.tokenBlockchain + '_MIN_GAS_ERC20'
      );
      if (typeof minGas === 'undefined' || !minGas) {
        minGas = BlocksoftExternalSettings.getStatic('ETH_MIN_GAS_ERC20');
      }
      if (typeof minGas === 'undefined' || !minGas) {
        minGas = 70200;
      }
      if (estimatedGas < minGas) {
        estimatedGas = minGas;
      }
    } catch (e) {
      this.checkError(e, data);
    }
    const result = await super.getFeeRate(tmpData, privateData, {
      ...additionalData,
      ...{ gasLimit: estimatedGas }
    });
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    const tmpData = { ...data };
    if (!tmpData.amount || tmpData.amount === '0') {
      try {
        // @ts-ignore
        tmpData.amount = await this._token.methods
          .balanceOf(data.addressFrom)
          .call();
      } catch (e) {
        this.checkError(e, data);
      }
    }

    const result = await super.getTransferAllBalance(
      tmpData,
      privateData,
      additionalData
    );
    return result;
  }

  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
      return super.sendTx(data, privateData, uiData);
    }
    const tmpData = { ...data };
    if (
      typeof data.transactionRemoveByFee !== 'undefined' &&
      data.transactionRemoveByFee
    ) {
      tmpData.amount = '0';
      return super.sendTx(tmpData, privateData, uiData);
    }

    try {
      const basicAddressTo = data.addressTo.toLowerCase();
      tmpData.blockchainData = this._token.methods
        .transfer(basicAddressTo, data.amount)
        .encodeABI();
      tmpData.basicAddressTo = basicAddressTo;
      tmpData.basicAmount = data.amount;
      tmpData.basicToken = this._tokenAddress;
    } catch (e) {
      this.checkError(e, data);
    }
    tmpData.amount = '0';
    tmpData.addressTo = this._tokenAddress;
    return super.sendTx(tmpData, privateData, uiData);
  }
}
