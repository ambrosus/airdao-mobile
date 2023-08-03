/**
 * @author Ksu
 * @version 0.20
 * https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken
 */
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';
import EthTransferProcessor from '../eth/EthTransferProcessor';

import BnbSmartNetworkPrices from './basic/BnbSmartNetworkPrices';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

export default class BnbSmartTransferProcessor
  extends EthTransferProcessor
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
        this._mainCurrencyCode + '_FORCE_PRICE'
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
        if (this._etherscanApiPathForFee) {
          const tmpPrice = await BnbSmartNetworkPrices.getFees(
            this._mainCurrencyCode,
            this._etherscanApiPathForFee,
            defaultFee,
            'BnbSmartTransferProcessor.getFeeRate'
          );
          if (tmpPrice * 1 > defaultFee * 1) {
            defaultFee = tmpPrice * 1;
          }
        }
        additionalData.gasPrice = defaultFee;
        additionalData.gasPriceTitle = 'speed_blocks_2';
      }
    }
    return super.getFeeRate(data, privateData, additionalData);
  }
}
