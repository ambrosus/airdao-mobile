/**
 * @version 0.52
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import DogeSendProvider from '@crypto/blockchains/doge/providers/DogeSendProvider';

const API_URL = 'https://api.blockchair.com/bitcoin/testnet/push/transaction';

export default class BtcTestSendProvider
  extends DogeSendProvider
  implements AirDAOBlockchainTypes.SendProvider
{
  async sendTx(
    hex: string,
    subtitle: string,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any; logData: any }> {
    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' BtcTestSendProvider.sendTx ' +
        subtitle +
        ' started ',
      logData
    );

    // logData = await this._check(hex, subtitle, txRBF, logData)

    let res;
    try {
      res = await BlocksoftAxios.post(API_URL, { data: hex });
    } catch (e) {
      try {
        logData.error = e.message;
        // await this._checkError(hex, subtitle, txRBF, logData)
      } catch (e2) {
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' BtcTestSendProvider.send proxy error errorTx ' +
            e2.message
        );
      }
      if (
        e.message.indexOf('transaction already in the mempool') !== -1 ||
        e.message.indexOf('TXN-MEMPOOL-CONFLICT')
      ) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (e.message.indexOf('dust') !== -1) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_DUST');
      } else if (
        e.message.indexOf('bad-txns-inputs-spent') !== -1 ||
        e.message.indexOf('txn-mempool-conflict') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (
        e.message.indexOf('fee for relay') !== -1 ||
        e.message.indexOf('insufficient priority') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE');
      } else {
        throw e;
      }
    }
    let txid = '';
    // @ts-ignore
    if (typeof res.data === 'undefined' || !res.data) {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }
    // @ts-ignore
    if (
      typeof res.data !== 'undefined' &&
      typeof res.data.txid !== 'undefined'
    ) {
      // @ts-ignore
      txid = res.data.txid;
    }
    // @ts-ignore
    if (typeof res.data.data !== 'undefined') {
      // @ts-ignore
      if (typeof res.data.data.transaction_hash !== 'undefined') {
        // @ts-ignore
        txid = res.data.data.transaction_hash;
      }
    }
    if (txid === '') {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }

    // logData = await this._checkSuccess(txid, hex, subtitle, txRBF, logData)

    return { transactionHash: txid, transactionJson: {}, logData };
  }
}
