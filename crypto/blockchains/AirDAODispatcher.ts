/**
 * @author Ksu
 * @version 0.5
 */

import EthAddressProcessor from '@crypto/blockchains/eth/EthAddressProcessor';
import EthScannerProcessor from '@crypto/blockchains/eth/EthScannerProcessor';
import EthScannerProcessorErc20 from '@crypto/blockchains/eth/EthScannerProcessorErc20';
import { BlockchainUtils } from '@utils/blockchain';

class AirDAODispatcher {
  getAddressProcessor(currencyCode: string): EthAddressProcessor {
    const currencyDictSettings =
      BlockchainUtils.getCurrencyAllSettings(currencyCode);
    return this.innerGetAddressProcessor(currencyDictSettings);
  }

  innerGetAddressProcessor(
    currencyDictSettings: any // TODO
  ): EthAddressProcessor {
    switch (currencyDictSettings.addressProcessor) {
      case 'ETH':
        return new EthAddressProcessor(currencyDictSettings);
      default:
        throw new Error(
          'Unknown addressProcessor ' + currencyDictSettings.addressProcessor
        );
    }
  }

  getScannerProcessor(
    currencyCode: string
  ): EthScannerProcessor | EthScannerProcessorErc20 {
    const currencyDictSettings =
      BlockchainUtils.getCurrencyAllSettings(currencyCode);
    switch (currencyDictSettings.scannerProcessor) {
      case 'ETH':
        return new EthScannerProcessor(currencyDictSettings);
      case 'ETH_ERC_20':
        return new EthScannerProcessorErc20(currencyDictSettings);
      default:
        throw new Error(
          'Unknown scannerProcessor ' + currencyDictSettings.scannerProcessor
        );
    }
  }
}

const singleAirDAODispatcher = new AirDAODispatcher();
export default singleAirDAODispatcher;
