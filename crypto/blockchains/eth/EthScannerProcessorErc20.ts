/**
 * @version 0.5
 */
import EthScannerProcessor from './EthScannerProcessor';
// import abi from './ext/erc20';
// import { Contract } from '@fioprotocol/fiojs/dist/chain-serialize';

export default class EthScannerProcessorErc20 extends EthScannerProcessor {
  /**
   * @type {boolean}
   * @private
   */
  // private _token: Contract;

  constructor(settings: {
    tokenAddress?: any;
    delegateAddress?: any;
    network?: any;
    tokenBlockchain?: any;
    tokenBlockchainCode?: string | undefined;
    currencyCode?: any;
  }) {
    // @ts-ignore
    super(settings);
    // @ts-ignore
    // this._token = new this._web3.eth.Contract(abi.ERC20, settings.tokenAddress);
    this._tokenAddress = settings.tokenAddress.toLowerCase();
    this._delegateAddress = (settings.delegateAddress || '').toLowerCase();

    if (
      this._etherscanApiPath &&
      typeof this._etherscanApiPath !== 'undefined'
    ) {
      // @ts-ignore
      const tmp = this._etherscanApiPath.split('/');
      this._etherscanApiPath = `https://${tmp[2]}/api?module=account&action=tokentx&sort=desc&contractaddress=${settings.tokenAddress}&apikey=YourApiKeyToken`;
    }
  }
}
