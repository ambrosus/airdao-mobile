/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';
import EthTransferProcessorErc20 from '../eth/EthTransferProcessorErc20';
import BnbSmartNetworkPrices from './basic/BnbSmartNetworkPrices';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

export default class BnbSmartTransferProcessorErc20
  extends EthTransferProcessorErc20
  implements AirDAOBlockchainTypes.TransferProcessor
{
  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: {} = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    if (
      typeof additionalData.gasPrice === 'undefined' ||
      !additionalData.gasPrice
    ) {
      const minFee = BlocksoftExternalSettings.getStatic(
        this._mainCurrencyCode + '_FORCE_PRICE_ERC20'
      );
      if (typeof minFee !== 'undefined' && minFee > 1) {
        additionalData.gasPrice = minFee;
        additionalData.gasPriceTitle = 'speed_blocks_2';
      } else {
        let defaultFee = BlocksoftExternalSettings.getStatic(
          this._mainCurrencyCode + '_PRICE'
        );
        if (typeof defaultFee === 'undefined' || !defaultFee) {
          defaultFee = 5000000000;
        }
        if (!this._etherscanApiPathForFee) {
          additionalData.gasPrice = defaultFee;
          additionalData.gasPriceTitle = 'speed_blocks_2';
        } else {
          additionalData.gasPrice = await BnbSmartNetworkPrices.getFees(
            this._mainCurrencyCode,
            this._etherscanApiPathForFee,
            defaultFee,
            'BnbSmartTransferProcessorErc20.getFeeRate'
          );
          additionalData.gasPriceTitle = 'speed_blocks_2';
        }
      }
    }
    const result = await super.getFeeRate(data, privateData, additionalData);
    result.shouldShowFees = true;
    return result;
  }

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
      const title =
        this._mainCurrencyCode === 'BNB'
          ? 'BNB Smart Chain'
          : this._mainCurrencyCode;
      // @ts-ignore
      return {
        isOk: false,
        code: 'TOKEN',
        parentBlockchain:
          title as AirDAOBlockchainTypes.CheckTransferHasErrorResult['parentBlockchain'],
        parentCurrency:
          title as AirDAOBlockchainTypes.CheckTransferHasErrorResult['parentCurrency']
      };
    }
  }
}
