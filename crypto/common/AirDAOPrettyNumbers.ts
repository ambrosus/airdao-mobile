import AirDAODict from './AirDAODict';
import AirDAOUtils from './AirDAOUtils';

class AirDAOPrettyNumbers {
  private _processorCode = '';
  private _decimals: number | undefined;

  /**
   * @param {string} currencyCode
   * @return {AirDAOPrettyNumbers}
   */
  setCurrencyCode(currencyCode: string): AirDAOPrettyNumbers {
    const settings = AirDAODict.getCurrencyAllSettings(currencyCode);
    if (settings.prettyNumberProcessor) {
      this._processorCode = settings.prettyNumberProcessor;
    } else {
      throw new Error(
        `AirDAODict.getCurrencyAllSettings no settings.prettyNumberProcessor for ${currencyCode}`
      );
    }
    if (
      typeof settings.decimals !== 'undefined' &&
      settings.decimals !== false
    ) {
      this._decimals = settings.decimals;
    } else {
      throw new Error(
        `AirDAODict.getCurrencyAllSettings no settings.decimals for ${currencyCode}`
      );
    }

    return this;
  }

  /**
   * @param {string} value
   * @return {string}
   */
  makeUnPretty(value: string | number): string {
    // tslint:disable-next-line:variable-name
    const number = value.toString().replace(' ', '');
    try {
      if (this._processorCode === 'USDT') {
        return number.toString();
      } else if (this._processorCode === 'ETH') {
        return AirDAOUtils.toWei(number) as unknown as string;
      } else if (this._processorCode === 'BTC') {
        return AirDAOUtils.toSatoshi(number);
      } else if (
        this._processorCode === 'ETH_ERC_20' ||
        this._processorCode === 'UNIFIED'
      ) {
        return AirDAOUtils.fromUnified(number, this._decimals || 0);
      }
    } catch (e: any) {
      e.message += 'in makeUnPretty';
      throw e;
    }
    throw new Error(
      'undefined BlocksoftPrettyNumbers processor to makeUnPretty'
    );
  }
}

export default new AirDAOPrettyNumbers();
