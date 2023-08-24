import { BigNumber } from 'bignumber.js';

class AirDAOBN {
  innerBN = false;
  constructor(val: BigNumber.Value) {
    // console.log('AirDAOBN construct', JSON.stringify(val))
    if (typeof val.innerBN !== 'undefined') {
      try {
        // noinspection JSCheckFunctionSignatures,JSUnresolvedVariable
        this.innerBN = new BigNumber(val.innerBN.toString());
      } catch (e: any) {
        throw new Error(e.message + ' while AirDAOBN.constructor ' + val);
      }
    } else {
      try {
        // noinspection JSCheckFunctionSignatures,JSUnresolvedVariable
        this.innerBN = new BigNumber(val);
      } catch (e: any) {
        throw new Error(e.message + ' while AirDAOBN.constructor ' + val);
      }
    }
  }

  toString() {
    return this.innerBN.toString();
  }
}

export default AirDAOBN;
