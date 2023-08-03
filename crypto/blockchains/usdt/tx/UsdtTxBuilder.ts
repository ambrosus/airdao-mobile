/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import BtcTxBuilder from '../../btc/tx/BtcTxBuilder';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';

import { TransactionBuilder, script, opcodes } from 'bitcoinjs-lib';

const USDT_TOKEN_ID = 31;

function toPaddedHexString(num: number, len: number) {
  const str = num.toString(16);
  return '0'.repeat(len - str.length) + str;
}

function createOmniSimpleSend(amountInUSD: string, propertyID = USDT_TOKEN_ID) {
  AirDAOCryptoLog.log('UsdtTxBuilder.createOmniSimpleSend started');
  const simpleSend = [
    '6f6d6e69', // omni
    '0000', // tx type
    '0000', // version
    toPaddedHexString(propertyID, 8),
    // @ts-ignore
    toPaddedHexString(Math.floor(amountInUSD * 100000000), 16)
  ].join('');

  return script.compile([opcodes.OP_RETURN, Buffer.from(simpleSend, 'hex')]);
}

export default class UsdtTxBuilder
  extends BtcTxBuilder
  implements AirDAOBlockchainTypes.TxBuilder
{
  _getRawTxAddOutput(
    txb: TransactionBuilder,
    output: AirDAOBlockchainTypes.OutputTx
  ): void {
    if (
      typeof output.tokenAmount !== 'undefined' &&
      output.tokenAmount &&
      output.tokenAmount !== '0'
    ) {
      const omniOutput = createOmniSimpleSend(output.tokenAmount);
      txb.addOutput(omniOutput, 0);
    } else {
      if (
        typeof output.amount !== 'undefined' &&
        output.amount.toString() === '0'
      ) {
        output.amount = '546';
      }
      super._getRawTxAddOutput(txb, output);
    }
  }
}
