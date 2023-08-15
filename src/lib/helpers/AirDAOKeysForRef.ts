/**
 * @author Javid
 * @version 0.5
 */
import AirDAOKeys from './AirDAOKeys';
import { WalletUtils } from '@utils/wallet';
import AirDAODispatcher from '../../../crypto/blockchains/AirDAODispatcher';

const CACHE: { [key: string]: any } = {};

class AirDAOKeysForRef {
  async discoverPublicAndPrivate(data: {
    mnemonic: string;
    index?: number;
  }): Promise<{
    currencyCode: {
      address: string;
      privateKey: string;
      path: string;
      index: number;
      type: unknown; // TODO
    }[];
  }> {
    const mnemonicCache = data.mnemonic.toLowerCase();
    if (typeof CACHE[mnemonicCache] !== 'undefined')
      return CACHE[mnemonicCache];
    let result = AirDAOKeys.getEthCached(mnemonicCache);
    // let result;
    if (!result) {
      let index = 0;
      const network = 'AMB';
      if (typeof data.index !== 'undefined') {
        index = data.index;
      }
      const root = await AirDAOKeys.getBip32Cached(data.mnemonic);
      let path;
      if (network === 'AMB') {
        path = `m/44'/16718'/${index}'/0/0`;
      } else if (network === 'ETH') {
        path = `m/44'/60'/${index}'/0/0`;
      }
      const child = root.derivePath(path);
      let processor;
      if (!processor) {
        throw new Error('Processor not initialized');
      }
      if (network === 'AMB') {
        processor = await AirDAODispatcher.getAddressProcessor('AMB');
      } else if (network === 'ETH') {
        processor = await AirDAODispatcher.getAddressProcessor('ETH');
      }
      result = await processor.getAddress(child.privateKey);
      result.index = index;
      result.path = path;
      if (index === 0) {
        AirDAOKeys.setEthCached(data.mnemonic, result);
      }
    }
    // noinspection JSPrimitiveTypeWrapperUsage
    result.cashbackToken = WalletUtils.addressToToken(result.address);
    CACHE[mnemonicCache] = result;
    return result;
  }

  async signDataForApi(msg: string, privateKey: string) {
    const processor = await AirDAODispatcher.getAddressProcessor('ETH');
    if (privateKey.substring(0, 2) !== '0x') {
      privateKey = '0x' + privateKey;
    }
    const signedData = await processor.signMessage(msg, privateKey);
    delete signedData.v;
    delete signedData.r;
    delete signedData.s;
    return signedData;
  }
}

const singleAirDAOKeysForRef = new AirDAOKeysForRef();
export default singleAirDAOKeysForRef;