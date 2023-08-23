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
   * @param {string|number} number
   * @return {string}
   */
  // tslint:disable-next-line:variable-name
  // async makePretty(number: string | number): Promise<string> {
  //   if (this._processorCode === 'USDT') {
  //     return number.toString();
  //   }
  //   const str = number.toString();
  //   if (str.indexOf('.') !== -1 || str.indexOf(',') !== -1) {
  //     number = str.split('.')[0].toString();
  //   }
  //   if (this._processorCode === 'ETH') {
  //     return AirDAOUtils.toEther(number);
  //   } else if (this._processorCode === 'BTC') {
  //     return AirDAOUtils.toBtc(number);
  //   } else if (
  //     this._processorCode === 'ETH_ERC_20' ||
  //     this._processorCode === 'UNIFIED'
  //   ) {
  //     return AirDAOUtils.toUnified(number, this._decimals || 0);
  //   }
  //   throw new Error('undefined BlocksoftPrettyNumbers processor to makePretty');
  // }

  // makeCut(
  //   tmp: string | number,
  //   size = 5,
  //   source = false,
  //   useDict = true
  // ): {
  //   cutted: string | number;
  //   isSatoshi: boolean;
  //   justCutted: string | number;
  //   separated: string;
  //   separatedForInput: string | false;
  // } {
  //   if (
  //     this._decimals &&
  //     this._decimals <= 6 &&
  //     size === 5 &&
  //     this._decimals > 0 &&
  //     useDict
  //   ) {
  //     size = this._decimals;
  //   }
  //   let cutted: string | number = 0;
  //   let isSatoshi = false;
  //   if (typeof tmp === 'undefined' || !tmp) {
  //     return {
  //       cutted,
  //       isSatoshi,
  //       justCutted: cutted,
  //       separated: '0',
  //       separatedForInput: false
  //     };
  //   }
  //   const splitted = tmp.toString().split('.');
  //   const def = '0.' + '0'.repeat(size);
  //   let firstPart: string | false = false;
  //   let secondPart: string | false = false;
  //   if (splitted[0] === '0') {
  //     if (typeof splitted[1] !== 'undefined' && splitted[1]) {
  //       cutted = splitted[0] + '.' + splitted[1].substr(0, size).toString(); // Convert to string
  //       if (cutted === def) {
  //         cutted =
  //           splitted[0] + '.' + splitted[1].substr(0, size * 2).toString(); // Convert to string
  //         const def2 = '0.' + '0'.repeat(size * 2);
  //         if (cutted !== def2) {
  //           secondPart = splitted[1].substr(0, size * 2);
  //         }
  //         isSatoshi = true;
  //       }
  //     } else {
  //       cutted = '0';
  //     }
  //   } else if (typeof splitted[1] !== 'undefined' && splitted[1]) {
  //     const second = splitted[1].substr(0, size).toString(); // Convert to string
  //     if (second !== '0'.repeat(size)) {
  //       cutted = splitted[0] + '.' + second;
  //       secondPart = second;
  //     } else {
  //       cutted = splitted[0];
  //     }
  //     firstPart = splitted[0] + '';
  //   } else {
  //     cutted = splitted[0];
  //     firstPart = splitted[0] + '';
  //   }
  //   let justCutted: string | number = isSatoshi ? '0' : cutted;
  //   if (justCutted === def) {
  //     justCutted = '0';
  //   }
  //
  //   if (secondPart) {
  //     for (let i = secondPart.length; i--; i >= 0) {
  //       if (typeof secondPart[i] === 'undefined' || secondPart[i] === '0') {
  //         secondPart = secondPart.substr(0, i);
  //       } else {
  //         break;
  //       }
  //     }
  //   }
  //
  //   let separated = justCutted;
  //   let separatedForInput: string | false = false;
  //   if (firstPart) {
  //     const len = firstPart.length;
  //     if (len > 3) {
  //       separated = '';
  //       let j = 0;
  //       for (let i = len - 1; i >= 0; i--) {
  //         if (j === 3) {
  //           separated = ' ' + separated;
  //           j = 0;
  //         }
  //         j++;
  //         separated = firstPart[i] + separated;
  //       }
  //     } else {
  //       separated = firstPart;
  //     }
  //     separatedForInput = separated.toString();
  //     if (secondPart) {
  //       separated += '.' + secondPart;
  //     }
  //   } else if (secondPart) {
  //     separated = '0.' + secondPart;
  //     separatedForInput = '0';
  //   }
  //   if (!separatedForInput) {
  //     separatedForInput = justCutted;
  //   } else if (typeof splitted[1] !== 'undefined') {
  //     separatedForInput += '.' + splitted[1];
  //   }
  //
  //   return {
  //     cutted,
  //     isSatoshi,
  //     justCutted,
  //     separated: separated.toString(),
  //     separatedForInput
  //   };
  // }

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
