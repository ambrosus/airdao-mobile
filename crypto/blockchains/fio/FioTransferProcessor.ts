/**
 * @version 0.20
 */
import { getFioSdk } from './FioSdkWrapper';
import { getFioBalance, transferTokens } from './FioUtils.jts';
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';
import BlocksoftUtils from '../../common/AirDAOUtils';

export default class FioTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  private _settings: any;

  constructor(settings: any) {
    this._settings = settings;
  }

  needPrivateForFee(): boolean {
    return false;
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return false;
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: {} = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const { fee = 0 } = await getFioSdk().getFee('transfer_tokens_pub_key');
    const result: AirDAOBlockchainTypes.FeeRateResult = {
      selectedFeeIndex: 0,
      shouldShowFees: false,
      fees: [
        {
          langMsg: 'xrp_speed_one',
          feeForTx: fee,
          amountForTx: data.amount
        }
      ]
    } as AirDAOBlockchainTypes.FeeRateResult;
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: any = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    const { fee = 0 } = await getFioSdk().getFee('transfer_tokens_pub_key');
    const balance = await getFioBalance(data.addressFrom);
    if (balance === 0) {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -1,
        fees: [],
        countedForBasicBalance: '0'
      };
    }

    const diff = BlocksoftUtils.diff(balance, fee);
    if (diff * 1 < 0) {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -2,
        fees: [],
        countedForBasicBalance: '0'
      };
    }

    const result: AirDAOBlockchainTypes.TransferAllBalanceResult = {
      selectedFeeIndex: 0,
      fees: [
        {
          langMsg: 'xrp_speed_one',
          feeForTx: fee,
          amountForTx: diff
        }
      ],
      selectedTransferAllBalance: diff
    } as AirDAOBlockchainTypes.TransferAllBalanceResult;
    return result;
  }

  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    if (
      typeof uiData !== 'undefined' &&
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.rawOnly !== 'undefined' &&
      uiData.selectedFee.rawOnly
    ) {
      // @todo ksu
      return {
        rawOnly: uiData.selectedFee.rawOnly,
        raw: 'feature in development'
      };
    }
    const txId = await transferTokens(data.addressTo, data.amount);
    return { transactionHash: txId, transactionJson: {} };
  }
}
