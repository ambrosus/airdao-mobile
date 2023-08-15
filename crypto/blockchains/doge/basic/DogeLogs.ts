/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import BlocksoftBN from '../../../common/AirDAOBN';
import BlocksoftUtils from '../../../common/AirDAOUtils';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';

export namespace DogeLogs {
  export const logInputsOutputs = function (
    data: AirDAOBlockchainTypes.TransferData,
    unspents: AirDAOBlockchainTypes.UnspentTx[],
    preparedInputsOutputs: {
      inputs: AirDAOBlockchainTypes.UnspentTx[];
      outputs: AirDAOBlockchainTypes.OutputTx[];
      multiAddress: [];
      msg: string;
    },
    settings: any,
    title: string
  ): any {
    const logInputsOutputs = {
      inputs: [],
      outputs: [],
      totalIn: 0,
      totalOut: 0,
      diffInOut: 0,
      msg: preparedInputsOutputs.msg || 'none'
    };
    const totalInBN = new BlocksoftBN(0);
    const totalOutBN = new BlocksoftBN(0);
    const totalBalanceBN = new BlocksoftBN(0);
    if (typeof unspents !== 'undefined' && unspents && unspents.length > 0) {
      for (const unspent of unspents) {
        totalBalanceBN.add(unspent.value);
      }
    }

    const leftBalanceBN = new BlocksoftBN(totalBalanceBN);
    const sendBalanceBN = new BlocksoftBN(0);
    let input, output;
    if (preparedInputsOutputs) {
      for (input of preparedInputsOutputs.inputs) {
        logInputsOutputs.inputs.push({
          txid: input.txid,
          vout: input.vout,
          value: input.value,
          confirmations: input.confirmations,
          address: input.address || 'none'
        });
        totalInBN.add(input.value);
        leftBalanceBN.diff(input.value);
      }
      for (output of preparedInputsOutputs.outputs) {
        if (output.amount === 'removed') continue;
        logInputsOutputs.outputs.push(output);
        totalOutBN.add(output.amount);
        if (typeof output.isChange === 'undefined' || !output.isChange) {
          sendBalanceBN.add(output.amount);
        }
      }
    }
    logInputsOutputs.totalIn = totalInBN.get();
    logInputsOutputs.totalOut = totalOutBN.get();
    logInputsOutputs.diffInOut = totalInBN.diff(totalOutBN).get();
    logInputsOutputs.diffInOutReadable = BlocksoftUtils.toUnified(
      logInputsOutputs.diffInOut,
      settings.decimals
    );

    const tmpBN = new BlocksoftBN(totalOutBN).diff(data.amount);
    if (logInputsOutputs.diffInOut > 0) {
      tmpBN.add(logInputsOutputs.diffInOut);
    }
    logInputsOutputs.totalOutMinusAmount = tmpBN.get();
    logInputsOutputs.totalBalance = totalBalanceBN.get();
    logInputsOutputs.leftBalance = leftBalanceBN.get();
    logInputsOutputs.leftBalanceAndChange = BlocksoftUtils.add(
      leftBalanceBN,
      tmpBN
    );
    logInputsOutputs.sendBalance = sendBalanceBN.get();

    logInputsOutputs.data = JSON.parse(JSON.stringify(data));
    if (
      typeof data.feeForTx === 'undefined' ||
      typeof data.feeForTx.feeForByte === 'undefined' ||
      data.feeForTx.feeForByte < 0
    ) {
      AirDAOCryptoLog.log(
        title + ' preparedInputsOutputs with autofee ',
        logInputsOutputs
      );
    } else {
      AirDAOCryptoLog.log(
        title + ' preparedInputsOutputs with fee ' + data.feeForTx.feeForTx,
        logInputsOutputs
      );
    }
    // console.log('btc_info ' + this._settings.currencyCode + ' ' + data.addressFrom  + ' => ' + data.addressTo, logInputsOutputs)
    return logInputsOutputs;
  };
}