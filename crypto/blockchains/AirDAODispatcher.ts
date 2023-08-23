/**
 * @author Ksu
 * @version 0.5
 */

// import BchAddressProcessor from '@crypto/blockchains/bch/BchAddressProcessor';
// import BchScannerProcessor from '@crypto/blockchains/bch/BchScannerProcessor';

// import BsvScannerProcessor from '@crypto/blockchains/bsv/BsvScannerProcessor';

// import BtcAddressProcessor from '@crypto/blockchains/btc/address/BtcAddressProcessor';
// import BtcScannerProcessor from '@crypto/blockchains/btc/BtcScannerProcessor';

// import BtcSegwitCompatibleAddressProcessor from '@crypto/blockchains/btc/address/BtcSegwitCompatibleAddressProcessor';
// import BtcSegwitAddressProcessor from '@crypto/blockchains/btc/address/BtcSegwitAddressProcessor';

// import BtcTestScannerProcessor from '@crypto/blockchains/btc_test/BtcTestScannerProcessor';

// import BtgScannerProcessor from '@crypto/blockchains/btg/BtgScannerProcessor';

// import DogeScannerProcessor from '@crypto/blockchains/doge/DogeScannerProcessor';

import EthAddressProcessor from '@crypto/blockchains/eth/EthAddressProcessor';
import EthScannerProcessor from '@crypto/blockchains/eth/EthScannerProcessor';
import EthScannerProcessorErc20 from '@crypto/blockchains/eth/EthScannerProcessorErc20';
import { BlockchainUtils } from '@utils/blockchain';
// import EthScannerProcessorSoul from '@crypto/blockchains/eth/forks/EthScannerProcessorSoul';
import EthTokenProcessorErc20 from '@crypto/blockchains/eth/EthTokenProcessorErc20';

// import LtcScannerProcessor from '@crypto/blockchains/ltc/LtcScannerProcessor';

// import TrxAddressProcessor from '@crypto/blockchains/trx/TrxAddressProcessor';
// import TrxScannerProcessor from '@crypto/blockchains/trx/TrxScannerProcessor';
// import TrxTokenProcessor from '@crypto/blockchains/trx/TrxTokenProcessor';

// import UsdtScannerProcessor from '@crypto/blockchains/usdt/UsdtScannerProcessor';

// import XrpAddressProcessor from '@crypto/blockchains/xrp/XrpAddressProcessor';
// import XrpScannerProcessor from '@crypto/blockchains/xrp/XrpScannerProcessor';

// import XlmAddressProcessor from '@crypto/blockchains/xlm/XlmAddressProcessor';
// import XlmScannerProcessor from '@crypto/blockchains/xlm/XlmScannerProcessor';

// import XvgScannerProcessor from '@crypto/blockchains/xvg/XvgScannerProcessor';

// import XmrAddressProcessor from '@crypto/blockchains/xmr/XmrAddressProcessor';
// import XmrScannerProcessor from '@crypto/blockchains/xmr/XmrScannerProcessor';
// import XmrSecretsProcessor from '@crypto/blockchains/xmr/XmrSecretsProcessor';
// import FioAddressProcessor from '@crypto/blockchains/fio/FioAddressProcessor';
// import FioScannerProcessor from '@crypto/blockchains/fio/FioScannerProcessor';

// import BnbAddressProcessor from '@crypto/blockchains/bnb/BnbAddressProcessor';
// import BnbScannerProcessor from '@crypto/blockchains/bnb/BnbScannerProcessor';
// import { BlockchainUtils } from '@utils/blockchain';

// import VetScannerProcessor from '@crypto/blockchains/vet/VetScannerProcessor';

// import SolAddressProcessor from '@crypto/blockchains/sol/SolAddressProcessor';
// import SolScannerProcessor from '@crypto/blockchains/sol/SolScannerProcessor';

// import WavesAddressProcessor from '@crypto/blockchains/waves/WavesAddressProcessor';
// import WavesScannerProcessor from '@crypto/blockchains/waves/WavesScannerProcessor';

// import SolScannerProcessorSpl from '@crypto/blockchains/sol/SolScannerProcessorSpl';
// import SolTokenProcessor from '@crypto/blockchains/sol/SolTokenProcessor';
import EthTokenProcessorNft from '@crypto/blockchains/eth/EthTokenProcessorNft';
// import AshAddressProcessor from '@crypto/blockchains/ash/AshAddressProcessor';

// import MetisScannerProcessor from '@crypto/blockchains/metis/MetisScannerProcessor';
// import OneScannerProcessor from '@crypto/blockchains/one/OneScannerProcessor';
// import OneScannerProcessorErc20 from '@crypto/blockchains/one/OneScannerProcessorErc20';

// import WavesScannerProcessorErc20 from '@crypto/blockchains/waves/WavesScannerProcessorErc20';

class AirDAODispatcher {
  getAddressProcessor(currencyCode: string): EthAddressProcessor {
    //   | BtcAddressProcessor
    // | TrxAddressProcessor
    // | XlmAddressProcessor
    // | SolAddressProcessor
    const currencyDictSettings =
      BlockchainUtils.getCurrencyAllSettings(currencyCode);
    return this.innerGetAddressProcessor(currencyDictSettings);
  }

  innerGetAddressProcessor(
    currencyDictSettings: any // TODO
  ): EthAddressProcessor {
    // | BtcAddressProcessor| TrxAddressProcessor| XlmAddressProcessor| SolAddressProcessor
    switch (currencyDictSettings.addressProcessor) {
      // case 'BCH':
      //   return new BchAddressProcessor(currencyDictSettings);
      // case 'BTC':
      //   return new BtcAddressProcessor(currencyDictSettings);
      // case 'BTC_SEGWIT':
      // case 'LTC_SEGWIT':
      //   return new BtcSegwitAddressProcessor(currencyDictSettings);
      // case 'BTC_SEGWIT_COMPATIBLE':
      //   return new BtcSegwitCompatibleAddressProcessor(currencyDictSettings);
      case 'ETH':
        return new EthAddressProcessor(currencyDictSettings);
      // case 'TRX':
      //   return new TrxAddressProcessor();
      // case 'XRP':
      //   return new XrpAddressProcessor();
      // case 'XLM':
      //   return new XlmAddressProcessor();
      // case 'XMR':
      //   return new XmrAddressProcessor();
      // case 'FIO':
      //   return new FioAddressProcessor();
      // case 'BNB':
      //   return new BnbAddressProcessor();
      // case 'SOL':
      //   return new SolAddressProcessor();
      // case 'WAVES':
      //   return new WavesAddressProcessor();
      // case 'ASH':
      //   return new AshAddressProcessor();
      default:
        throw new Error(
          'Unknown addressProcessor ' + currencyDictSettings.addressProcessor
        );
    }
  }

  getScannerProcessor(
    currencyCode: string
  ): EthScannerProcessor | EthScannerProcessorErc20 {
    //   | BsvScannerProcessor
    // | BtcScannerProcessor
    // | UsdtScannerProcessor
    // | EthScannerProcessorErc20
    // | BchScannerProcessor
    // | LtcScannerProcessor
    // | XvgScannerProcessor
    // | BtcTestScannerProcessor
    // | DogeScannerProcessor
    // | EthScannerProcessorSoul
    // | EthScannerProcessor
    // | BtgScannerProcessor
    // | TrxScannerProcessor
    // | XrpScannerProcessor
    // | XlmScannerProcessor
    // | XmrScannerProcessor
    // | FioScannerProcessor
    // | BnbScannerProcessor
    // | VetScannerProcessor
    // | SolScannerProcessor
    // | SolScannerProcessorSpl
    // | WavesScannerProcessor
    // | MetisScannerProcessor
    // | OneScannerProcessor
    // | OneScannerProcessorErc20
    // | WavesScannerProcessorErc20
    const currencyDictSettings =
      BlockchainUtils.getCurrencyAllSettings(currencyCode);
    switch (currencyDictSettings.scannerProcessor) {
      // case 'BCH':
      //   return new BchScannerProcessor(currencyDictSettings);
      // case 'BSV':
      //   return new BsvScannerProcessor();
      // case 'BTC':
      // case 'BTC_SEGWIT':
      // case 'BTC_SEGWIT_COMPATIBLE':
      //   return new BtcScannerProcessor(currencyDictSettings);
      // case 'BTC_TEST':
      //   return new BtcTestScannerProcessor();
      // case 'BTG':
      //   return new BtgScannerProcessor(currencyDictSettings);
      // case 'DOGE':
      //   return new DogeScannerProcessor(currencyDictSettings);
      case 'ETH':
        return new EthScannerProcessor(currencyDictSettings);
      case 'ETH_ERC_20':
        return new EthScannerProcessorErc20(currencyDictSettings);
      // case 'ETH_SOUL':
      //   return new EthScannerProcessorSoul(currencyDictSettings);
      // case 'LTC':
      //   return new LtcScannerProcessor(currencyDictSettings);
      // case 'TRX':
      //   return new TrxScannerProcessor(currencyDictSettings);
      // case 'USDT':
      //   return new UsdtScannerProcessor();
      // case 'XRP':
      //   return new XrpScannerProcessor();
      // case 'XLM':
      //   return new XlmScannerProcessor();
      // case 'XVG':
      //   return new XvgScannerProcessor();
      // case 'XMR':
      //   return new XmrScannerProcessor(currencyDictSettings);
      // case 'FIO':
      //   return new FioScannerProcessor(currencyDictSettings);
      // case 'BNB':
      //   return new BnbScannerProcessor();
      // case 'VET':
      //   return new VetScannerProcessor(currencyDictSettings);
      // case 'SOL':
      //   return new SolScannerProcessor(currencyDictSettings);
      // case 'SOL_SPL':
      //   return new SolScannerProcessorSpl(currencyDictSettings);
      // case 'WAVES':
      //   return new WavesScannerProcessor(currencyDictSettings);
      // case 'METIS':
      //   return new MetisScannerProcessor(currencyDictSettings);
      // case 'ONE':
      //   return new OneScannerProcessor(currencyDictSettings);
      // case 'ONE_ERC_20':
      //   return new OneScannerProcessorErc20(currencyDictSettings);
      // case 'WAVES_ERC_20':
      //   return new WavesScannerProcessorErc20(currencyDictSettings);
      default:
        throw new Error(
          'Unknown scannerProcessor ' + currencyDictSettings.scannerProcessor
        );
    }
  }

  // TODO enum tokenType
  getTokenProcessor(tokenType: string): EthTokenProcessorErc20 {
    switch (tokenType) {
      case 'ETH_ERC_20':
        return new EthTokenProcessorErc20({
          network: 'mainnet',
          tokenBlockchain: 'ETHEREUM'
        });
      case 'BNB_SMART_20':
        return new EthTokenProcessorErc20({
          network: 'mainnet',
          tokenBlockchain: 'BNB'
        });
      // case 'MATIC_ERC_20':
      //   return new EthTokenProcessorErc20({
      //     network: 'mainnet',
      //     tokenBlockchain: 'MATIC'
      //   });
      // case 'FTM_ERC_20':
      //   return new EthTokenProcessorErc20({
      //     network: 'mainnet',
      //     tokenBlockchain: 'FTM'
      //   });
      // case 'VLX_ERC_20':
      //   return new EthTokenProcessorErc20({
      //     network: 'mainnet',
      //     tokenBlockchain: 'VLX'
      //   });
      // case 'ONE_ERC_20':
      //   return new EthTokenProcessorErc20({
      //     network: 'mainnet',
      //     tokenBlockchain: 'ONE'
      //   });
      // case 'METIS_ERC_20':
      //   return new EthTokenProcessorErc20({
      //     network: 'mainnet',
      //     tokenBlockchain: 'METIS'
      //   });
      // case 'TRX':
      //   return new TrxTokenProcessor();
      // case 'SOL':
      //   return new SolTokenProcessor();
      default:
        throw new Error('Unknown tokenProcessor ' + tokenType);
    }
  }

  // TODO enum tokenBlockchainCode
  getTokenNftsProcessor(tokenBlockchainCode: string) {
    switch (tokenBlockchainCode) {
      case 'ETH':
      case 'NFT_ETH':
        return new EthTokenProcessorNft({
          network: 'mainnet',
          tokenBlockchain: 'ETHEREUM',
          tokenBlockchainCode: 'ETH'
        });
      case 'ETH_RINKEBY':
      case 'NFT_RINKEBY':
        return new EthTokenProcessorNft({
          network: 'rinkeby',
          tokenBlockchain: 'RINKEBY',
          tokenBlockchainCode: 'ETH_RINKEBY'
        });
      case 'MATIC':
      case 'NFT_MATIC':
        return new EthTokenProcessorNft({
          network: 'mainnet',
          tokenBlockchain: 'MATIC',
          tokenBlockchainCode: 'MATIC'
        });
      case 'BNB':
      case 'NFT_BNB':
        return new EthTokenProcessorNft({
          network: 'mainnet',
          tokenBlockchain: 'BNB',
          tokenBlockchainCode: 'BNB'
        });
      case 'ONE':
      case 'NFT_ONE':
        return new EthTokenProcessorNft({
          network: 'mainnet',
          tokenBlockchain: 'ONE',
          tokenBlockchainCode: 'ONE'
        });
      case 'ETH_ROPSTEN':
      case 'NFT_ROPSTEN':
        return new EthTokenProcessorNft({
          network: 'ropsten',
          tokenBlockchain: 'ROPSTEN',
          tokenBlockchainCode: 'ETH_ROPSTEN'
        });
      default:
        throw new Error('Unknown NFT tokenProcessor ' + tokenBlockchainCode);
    }
  }

  // getSecretsProcessor(currencyCode: string): XmrSecretsProcessor {
  //   const currencyDictSettings =
  //     BlockchainUtils.getCurrencyAllSettings(currencyCode);
  //   if (currencyDictSettings.currencyCode !== 'XMR') {
  //     throw new Error(
  //       'Unknown secretsProcessor ' + currencyDictSettings.currencyCode
  //     );
  //   }
  //   return new XmrSecretsProcessor();
  // }
}

const singleAirDAODispatcher = new AirDAODispatcher();
export default singleAirDAODispatcher;
