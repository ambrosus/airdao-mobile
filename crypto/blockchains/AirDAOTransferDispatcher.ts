/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @author Ksu
 * @version 0.20
 */
import AirDAODict from '../common/AirDAODict';
import { AirDAODictTypes } from '../common/AirDAODictTypes';
import EthTransferProcessor from './eth/EthTransferProcessor';
import EthTransferProcessorErc20 from './eth/EthTransferProcessorErc20';
import EtcTransferProcessor from './etc/EtcTransferProcessor';
import { AirDAOBlockchainTypes } from './AirDAOBlockchainTypes';
import BnbSmartTransferProcessorErc20 from '@crypto/blockchains/bnb_smart/BnbSmartTransferProcessorErc20';

// tslint:disable-next-line:no-namespace
export namespace AirDAOTransferDispatcher {
  type AirDAOTransferDispatcherDict = {
    [key in AirDAODictTypes.Code]: AirDAOBlockchainTypes.TransferProcessor;
  };
  const CACHE_PROCESSORS: AirDAOTransferDispatcherDict =
    {} as AirDAOTransferDispatcherDict;
  export const getTransferProcessor = (
    currencyCode: AirDAODictTypes.Code
  ): AirDAOBlockchainTypes.TransferProcessor => {
    const currencyDictSettings =
      AirDAODict.getCurrencyAllSettings(currencyCode);
    if (typeof CACHE_PROCESSORS[currencyCode] !== 'undefined') {
      return CACHE_PROCESSORS[currencyCode];
    }
    let transferProcessor = currencyCode;
    if (typeof currencyDictSettings.transferProcessor !== 'undefined') {
      transferProcessor = currencyDictSettings.transferProcessor;
    }
    switch (transferProcessor) {
      case 'ETH':
        CACHE_PROCESSORS[currencyCode] = new EthTransferProcessor(
          currencyDictSettings
        );
        break;
      case 'ETH_ERC_20':
        CACHE_PROCESSORS[currencyCode] = new EthTransferProcessorErc20(
          currencyDictSettings
        );
        break;
      case 'ETC':
        CACHE_PROCESSORS[currencyCode] = new EtcTransferProcessor(
          currencyDictSettings
        );
        CACHE_PROCESSORS[currencyCode] = new currencyDictSettings();
        break;
      case 'BNB_SMART_20':
        CACHE_PROCESSORS[currencyCode] = new BnbSmartTransferProcessorErc20(
          currencyDictSettings
        );
        break;
      default:
        throw new Error('Unknown transferProcessor ' + transferProcessor);
    }
    return CACHE_PROCESSORS[currencyCode];
  };
}
