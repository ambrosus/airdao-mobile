/**
 * @author Ksu
 * @version 0.43
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import EthTransferProcessor from '@crypto/blockchains/eth/EthTransferProcessor';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftUtils from '@crypto/common/AirDAOUtils';

export default class MetisTransferProcessor
  extends EthTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  private _mainCurrencyCode: string | undefined;

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    if (
      typeof additionalData.gasPrice === 'undefined' ||
      !additionalData.gasPrice
    ) {
      additionalData.gasPrice = BlocksoftExternalSettings.getStatic(
        this._mainCurrencyCode + '_PRICE'
      );
      additionalData.gasPriceTitle = 'speed_blocks_2';
    }

    let value = 0;
    try {
      if (data.amount.indexOf('0x') === 0) {
        value = parseInt(data.amount, 16);
      } else {
        value = parseInt('0x' + BlocksoftUtils.decimalToHex(data.amount), 16);
      }
    } catch (e: any) {
      throw new Error(e.message + ' with data.amount ' + data.amount);
    }

    const params = {
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [
        {
          from: data.addressFrom,
          to: data.addressTo,
          value,
          data: '0x'
        }
      ],
      id: 1
    };

    try {
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      const { data } = await BlocksoftAxios.post(
        BlocksoftExternalSettings.getStatic('METIS_SERVER'),
        params
      );

      if (typeof data !== 'undefined' && typeof data.result !== 'undefined') {
        // @ts-ignore
        additionalData.gasLimit = BlocksoftUtils.hexToDecimalWalletConnect(
          data.result
        );
      } else if (
        typeof data !== 'undefined' &&
        typeof data.error !== 'undefined'
      ) {
        throw new Error(data.error.message);
      }
    } catch (error: any) {
      throw new Error('Error fetching gas estimate: ' + error.message);
    }

    return super.getFeeRate(data, privateData, additionalData);
  }

  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction,
    source: string
  ): boolean {
    return false;
  }
}
