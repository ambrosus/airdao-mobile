/**
 * @version 0.20
 **/
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';

export default class DogeNetworkPrices
  implements AirDAOBlockchainTypes.NetworkPrices
{
  async getNetworkPrices(currencyCode: string): Promise<{
    speed_blocks_2: number;
    speed_blocks_6: number;
    speed_blocks_12: number;
  }> {
    AirDAOCryptoLog.log(currencyCode + ' DogeNetworkPricesProvider ');

    const externalSettings = await BlocksoftExternalSettings.getAll(
      'DOGE.getNetworkPrices'
    );

    // @ts-ignore
    if (
      !externalSettings ||
      typeof externalSettings[currencyCode] === 'undefined'
    ) {
      throw new Error(
        currencyCode +
          ' DogeNetworkPricesProvider ' +
          currencyCode +
          ' not defined'
      );
    }

    const prices = {
      // @ts-ignore
      speed_blocks_2: externalSettings[currencyCode]['2'] || 0,
      // @ts-ignore
      speed_blocks_6: externalSettings[currencyCode]['6'] || 0,
      // @ts-ignore
      speed_blocks_12: externalSettings[currencyCode]['12'] || 0
    };
    return prices;
  }
}