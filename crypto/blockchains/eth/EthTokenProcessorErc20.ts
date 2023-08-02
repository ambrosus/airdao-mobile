/**
 * @version 0.5
 */
import EthBasic from './basic/EthBasic';
import abi from './ext/erc20.js';

export default class EthTokenProcessorErc20 extends EthBasic {
  /**
   * @param {string} tokenAddress
   * @returns {Promise<{tokenAddress: *, currencyName: *, provider: string, tokenDecimals: *, icon: boolean, description: boolean, tokenType: string, currencyCode: *}>}
   */
  async getTokenDetails(tokenAddress: string): Promise<{
    tokenAddress: string;
    currencyName: string;
    provider: string;
    tokenDecimals: string;
    icon: boolean;
    description: boolean;
    tokenType: string;
    currencyCode: string;
  }> {
    let token, name, symbol, decimals;

    this.checkWeb3CurrentServerUpdated();

    try {
      // noinspection JSUnresolvedVariable
      token = new this._web3.eth.Contract(
        abi.ERC20,
        tokenAddress.toLowerCase()
      );
    } catch (err) {
      const e = err as unknown as any;
      e.message = 'erc20 init token ' + e.message;
      throw e;
    }
    try {
      name = await token.methods.name().call();
    } catch (err) {
      const e = err as unknown as any;
      e.message = 'erc20.name ' + e.message;
      throw e;
    }

    try {
      symbol = await token.methods.symbol().call();
    } catch (err) {
      const e = err as unknown as any;
      e.message = 'erc20.symbol ' + e.message;
      throw e;
    }

    try {
      decimals = await token.methods.decimals().call();
    } catch (err) {
      const e = err as unknown as any;
      e.message = 'erc20.decimals ' + e.message;
      throw e;
    }

    const res = {
      currencyCodePrefix: 'CUSTOM_',
      currencyCode: symbol,
      currencyName: name,
      tokenType: this._mainTokenType,
      tokenAddress: tokenAddress.toLowerCase(),
      tokenDecimals: decimals,
      icon: false,
      description: false,
      provider: 'web3'
    };
    if (this._mainCurrencyCode !== 'ETH') {
      res.currencyCodePrefix = 'CUSTOM_' + this._mainTokenType + '_';
    }
    return res;
  }
}
