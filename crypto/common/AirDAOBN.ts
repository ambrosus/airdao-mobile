import { BigNumber } from 'bignumber.js';
import BlocksoftUtils from './AirDAOUtils';

class AirDAOBN {
  innerBN = false;
  constructor(val) {
    // console.log('AirDAOBN construct', JSON.stringify(val))
    if (typeof val.innerBN !== 'undefined') {
      try {
        // noinspection JSCheckFunctionSignatures,JSUnresolvedVariable
        this.innerBN = new BigNumber(val.innerBN.toString());
      } catch (e) {
        throw new Error(e.message + ' while AirDAOBN.constructor ' + val);
      }
    } else {
      try {
        // noinspection JSCheckFunctionSignatures,JSUnresolvedVariable
        this.innerBN = new BigNumber(val);
      } catch (e) {
        throw new Error(e.message + ' while AirDAOBN.constructor ' + val);
      }
    }
  }

  get() {
    return this.innerBN.toString();
  }

  toString() {
    return this.innerBN.toString();
  }

  lessThanZero() {
    return this.innerBN.toString().indexOf('-') === 0;
  }

  add(val) {
    // console.log('AirDAOBN add ', JSON.stringify(val))
    if (
      typeof val === 'undefined' ||
      !val ||
      val.toString() === '0' ||
      val === 'null' ||
      val === 'false'
    ) {
      return this;
    }
    let val2;
    if (typeof val !== 'string' && typeof val !== 'number') {
      if (typeof val.innerBN !== 'undefined') {
        val2 = val.innerBN;
      } else {
        throw new Error(
          'AirDAOBN.add unsupported type ' +
            typeof val +
            ' ' +
            JSON.stringify(val)
        );
      }
    } else {
      try {
        val = BlocksoftUtils.fromENumber(val);
        val2 = BigNumber(val);
      } catch (e) {
        throw new Error(e.message + ' while AirDAOBN.add transform ' + val);
      }
    }
    try {
      this.innerBN = this.innerBN.plus(val2);
    } catch (e) {
      throw new Error(e.message + ' while AirDAOBN.add ' + val);
    }
    return this;
  }

  diff(val) {
    // console.log('AirDAOBN diff ', JSON.stringify(val))
    if (typeof val === 'undefined' || !val || val.toString() === '0') {
      return this;
    }
    let val2;
    if (typeof val !== 'string' && typeof val !== 'number') {
      if (typeof val.innerBN !== 'undefined') {
        val2 = val.innerBN;
      } else {
        throw new Error(
          'AirDAOBN.diff unsupported type ' +
            typeof val +
            ' ' +
            JSON.stringify(val)
        );
      }
    } else {
      try {
        val = BlocksoftUtils.fromENumber(val);
        val2 = BigNumber(val);
      } catch (e) {
        throw new Error(e.message + ' while AirDAOBN.diff transform ' + val);
      }
    }
    try {
      this.innerBN = this.innerBN.minus(val2);
    } catch (e) {
      throw new Error(e.message + ' while AirDAOBN.minus ' + val);
    }
    return this;
  }
}

export default AirDAOBN;
