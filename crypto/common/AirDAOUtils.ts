import { BigNumber } from 'bignumber.js';
// @ts-ignore
import { hexToBn, bnToHex } from '../blockchains/eth/ext/estimateGas/util';
// @ts-ignore
import Log from '../../app/services/Log/Log';
import BigIntXmr from '@crypto/blockchains/xmr/ext/vendor/biginteger';
import Web3 from 'web3';
import { EtherUnits } from 'web3-utils';

class AirDAOUtils {
  static cutZeros(val: any): string {
    const tmp = val.toString().split('.');
    if (typeof tmp[1] === 'undefined' || !tmp[1]) return tmp[0];

    let firstNonZero = -1;
    let i = tmp[1].length - 1;
    do {
      const char = tmp[1][i];
      if (char !== '0') {
        firstNonZero = i;
      }
      i--;
    } while (firstNonZero === -1 && i >= 0);
    const last = tmp[1].substr(0, firstNonZero + 1);
    if (!last || last === '') return tmp[0];
    return tmp[0] + '.' + last;
  }

  static round(val: any): string {
    const tmp = val.toString().split('.');
    return tmp[0].replace(' ', '');
  }

  static add(val1: any, val2: any): string {
    let res: any = 0;
    if (typeof val1 === 'undefined') {
      res = val2 || '';
    } else if (
      typeof val2 === 'undefined' ||
      val2 === 0 ||
      val2 === '0' ||
      !val2
    ) {
      res = val1;
    } else if (typeof val1.innerBN !== 'undefined') {
      if (typeof val2.innerBN !== 'undefined') {
        res = val1.innerBN.plus(val2.innerBN).toString();
      } else {
        res = val1.innerBN.plus(new BigNumber(val2)).toString();
      }
    } else if (!val2 || !(val2 * 1 > 0)) {
      res = val1;
    } else {
      const str = val1.toString() + val2.toString();
      if (str.indexOf('.') !== -1 || str.indexOf(',') !== -1) {
        res = val1 * 1 + val2 * 1;
      } else {
        try {
          res = new BigNumber(val1).plus(new BigNumber(val2)).toString();
        } catch (e) {
          res = val1 * 1 + val2 * 1;
        }
      }
    }
    return AirDAOUtils.fromENumber(res);
  }

  static mul(val1: any, val2: any): string {
    if (typeof val1 === 'undefined') {
      return '';
    }
    if (typeof val2 === 'undefined') {
      return val1;
    }
    if (val2 === '1' || val2 === 1) {
      return val1;
    }
    if (typeof val1.innerBN !== 'undefined') {
      if (typeof val2.innerBN !== 'undefined') {
        return val1.innerBN.times(val2.innerBN).toString();
      } else {
        return val1.innerBN.times(new BigNumber(val2)).toString();
      }
    }
    const str = val1.toString() + val2.toString();
    let res: any = 0;
    if (str.indexOf('.') !== -1 || str.indexOf(',') !== -1) {
      res = val1 * val2;
    } else {
      try {
        res = new BigNumber(val1).times(new BigNumber(val2)).toString();
      } catch (e) {
        res = val1 * val2;
      }
    }
    return AirDAOUtils.fromENumber(res);
  }

  static div(val1: any, val2: any): string {
    if (typeof val1 === 'undefined') {
      return '';
    }
    if (typeof val2 === 'undefined') {
      return val1;
    }
    if (val2 === '1' || val2 === 1) {
      return val1;
    }
    if (typeof val1.innerBN !== 'undefined') {
      if (typeof val2.innerBN !== 'undefined') {
        return val1.innerBN.dividedBy(val2.innerBN).toString();
      } else {
        return val1.innerBN.dividedBy(new BigNumber(val2 + '')).toString();
      }
    }
    const str = val1.toString() + val2.toString();
    let res: any = 0;
    if (str.indexOf('.') !== -1 || str.indexOf(',') !== -1) {
      res = val1 / val2;
    } else {
      let addedZeros = false;
      if (val1.length <= val2.length + 2) {
        val1 += '00000000';
        addedZeros = true;
      }
      try {
        res = new BigNumber(val1).dividedBy(new BigNumber(val2)).toString();
        if (addedZeros) {
          res = res / 100000000;
        }
      } catch (e) {
        res = val1 / val2;
      }
    }
    return AirDAOUtils.fromENumber(res);
  }

  static diff(val1: any, val2: any): string {
    if (typeof val1 === 'undefined') {
      return val2 || '';
    }
    if (typeof val2 === 'undefined') {
      return val1;
    }
    if (!val2) {
      return val1;
    }
    if (!val1) {
      return (-1 * val2).toString();
    }
    if (typeof val1.innerBN !== 'undefined') {
      if (typeof val2.innerBN !== 'undefined') {
        return val1.innerBN.minus(val2.innerBN).toString();
      } else {
        return val1.innerBN.minus(new BigNumber(val2 + '')).toString();
      }
    }
    const str = val1.toString() + val2.toString();
    let res: any = 0;
    if (str.indexOf('.') !== -1 || str.indexOf(',') !== -1) {
      res = val1 - val2;
    } else {
      try {
        res = new BigNumber(val1).minus(new BigNumber(val2 + '')).toString();
      } catch (e) {
        res = val1 - val2;
      }
    }
    return AirDAOUtils.fromENumber(res);
  }

  static fromENumber(val: any): string {
    if (val === null || typeof val === 'undefined' || !val) {
      return '0';
    }
    val = val.toString().toLowerCase();
    if (val.indexOf('0x') === 0) {
      return BigIntXmr.BigInteger(val).toString();
    }
    if (val.indexOf('e') === -1) {
      return val;
    }
    const parts = val.split('e');
    // tslint:disable-next-line:variable-name
    const number = parts[1].substr(0, 1);
    const power = parseInt(parts[1].substr(1), 2);
    const first = parts[0].split('.');
    if (number === '+') {
      return this.fromUnified(parts[0], power);
    } else if (typeof power !== 'undefined' && power * 1 > 0) {
      return (
        '0.' +
        '0'.repeat(power - 1) +
        first[0] +
        (typeof first[1] !== 'undefined' ? first[1] : '')
      );
    } else {
      return '0.0';
    }
  }

  static toSatoshi(val: any): string {
    return this.fromUnified(val, 8);
  }

  static toBtc(val: any): string {
    return this.toUnified(val, 8);
  }

  static toUnified(val: any, decimals = 8): string {
    if (typeof val === 'undefined' || val === 'undefined' || !val) {
      return '0';
    }
    if (typeof val === 'object') {
      val = val.toString();
    }
    if (typeof val === 'number') {
      // @ts-ignore // TODO remove this and fix
      val += '';
    }
    let added = '';
    const till = 18 - decimals;
    if (till < 0) {
      throw new Error('toUnified till is less than 0, decimals = ' + decimals);
    }
    for (let i = 0; i < till; i++) {
      added += '0';
    }
    const parts = val.split('.');
    const tmp = parts[0] + added;
    const res = Web3.utils.fromWei(tmp, 'ether');
    return res;
  }

  static fromUnified(val: any, decimals = 8): string {
    if (typeof val === 'undefined') return '0';
    val = val.toString();
    const parts = val.split('.');
    // tslint:disable-next-line:variable-name
    let number = parts[0];
    if (!parts[1] || !parts[1].length) return number + '0'.repeat(decimals);

    const letters = parts[1].split('');
    let needToFill = decimals;
    for (let i = 0, ic = letters.length; i < ic; i++) {
      needToFill--;
      number += letters[i];
      if (needToFill === 0) break;
    }
    for (let i = 0; i < needToFill; i++) {
      number += '0';
    }

    let cutted = '';
    let started = false;
    for (let i = 0, ic = number.length; i < ic; i++) {
      if (!started && number[i] === '0') continue;
      cutted += number[i];
      started = true;
    }

    return cutted || '0';
  }

  static toWei(val: any, from = 'ether'): string {
    if (typeof val === 'undefined') {
      throw new Error('toWei val is undefined');
    }
    if (typeof val === 'number') {
      // @ts-ignore // TODO remove this and fix
      val += '';
    }
    const parts = val.toString().split('.');
    if (typeof parts[1] === 'undefined' || parts[1] === '' || !parts[1]) {
      return Web3.utils.toWei(
        val,
        from as
          | 'noether'
          | 'wei'
          | 'kwei'
          | 'Kwei'
          | 'babbage'
          | 'femtoether'
          | 'mwei'
          | 'Mwei'
          | 'lovelace'
          | 'picoether'
          | 'gwei'
          | 'Gwei'
          | 'shannon'
          | 'nanoether'
          | 'nano'
          | 'szabo'
          | 'microether'
          | 'micro'
          | 'finney'
          | 'milliether'
          | 'milli'
          | 'ether'
          | 'kether'
          | 'grand'
          | 'mether'
          | 'gether'
          | 'tether'
      );
    }

    let decimals = 18;
    if (from === 'gwei') {
      decimals = 9;
    }
    const newVal = parts[0] + '.' + parts[1].substring(0, decimals);
    return Web3.utils.toWei(newVal, from as EtherUnits);
  }

  static toGwei(val: any): string {
    if (typeof val === 'number') {
      // @ts-ignore // TODO remove this and fix
      val += '';
    }

    let newVal = '0';
    try {
      const tmp = val.toString().split('.');
      newVal = Web3.utils.fromWei(tmp[0], 'gwei');
    } catch (e: any) {
      e.message = JSON.stringify(val) + ' ' + e.message;
      Log.err('BlocksoftUtils.toGwei error ' + e.message);
    }
    return newVal;
  }

  static toEther(val: any): string {
    if (typeof val === 'number') {
      // @ts-ignore // TODO remove this and fix
      val += '';
    }

    let newVal = '';
    try {
      newVal = Web3.utils.fromWei(val.toString(), 'ether');
    } catch (e: any) {
      e.message = JSON.stringify(val) + ' ' + e.message;
    }
    return newVal;
  }

  static toDate(timeStamp: number, multiply = true): string {
    if (timeStamp.toString().indexOf('T') !== -1) {
      return timeStamp.toString();
    } else if (timeStamp && timeStamp > 0) {
      if (multiply) {
        timeStamp = timeStamp * 1000;
      }
      return new Date(timeStamp).toISOString();
    } else {
      return new Date().toISOString();
    }
  }

  static hexToUtf(hex: string): string {
    return Web3.utils.hexToUtf8(hex);
  }

  static utfToHex(str: string): string {
    return Web3.utils.utf8ToHex(str);
  }

  static hexToDecimal(hex: string): bigint | number | string {
    if (hex.toString().indexOf('0x') === 0) {
      return Web3.utils.hexToNumber(hex);
    }
    return hex;
  }

  static hexToDecimalWalletConnect(hex: string): string {
    return hexToBn(hex).toString();
  }

  static decimalToHexWalletConnect(decimal: string): string {
    return bnToHex(decimal);
  }

  static decimalToHex(decimal: number | string, len = 0): string {
    let str = Web3.utils.toHex(decimal).substr(2);
    if (len > 0) {
      if (len < str.length) {
        throw new Error(
          `hex ${decimal} => ${str} is longer than ${len} and equal ${str.length}`
        );
      }
      str = '0'.repeat(len - str.length) + str;
    }
    return str;
  }

  static hexToDecimalBigger(hex: string): string {
    return BigIntXmr.BigInteger(hex).toString();
  }
}

export default AirDAOUtils;
