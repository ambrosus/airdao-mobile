/**
 * @version 0.5
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import DogeSendProvider from '@crypto/blockchains/doge/providers/DogeSendProvider';
import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import AirDAOAxios from '@crypto/common/AirDAOAxios';

export default class BsvSendProvider
  extends DogeSendProvider
  implements AirDAOBlockchainTypes.SendProvider
{
  async sendTx(
    hex: string,
    subtitle: string,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' BsvSendProvider.sendTx ' +
        subtitle +
        ' started ',
      logData
    );

    const link = 'https://api.whatsonchain.com/v1/bsv/main/tx/raw';

    //logData = await this._check(hex, subtitle, txRBF, logData)

    let res;
    try {
      res = await AirDAOAxios.post(link, { txhex: hex });
    } catch (e) {
      if (subtitle.indexOf('rawSend') !== -1) {
        throw e;
      }
      try {
        logData.error = e.message;
        await this._checkError(hex, subtitle, txRBF, logData);
      } catch (e2) {
        AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' DogeSendProvider.send proxy error errorTx ' +
            e2.message
        );
      }
      if (
        this._settings.currencyCode === 'USDT' &&
        e.message.indexOf('bad-txns-in-belowout') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_FEE');
      } else if (e.message.indexOf('transaction already in block') !== -1) {
        throw new Error('SERVER_RESPONSE_TRANSACTION_ALREADY_MINED');
      } else if (e.message.indexOf('inputs-missingorspent') !== -1) {
        throw new Error('SERVER_RESPONSE_TRANSACTION_ALREADY_MINED');
      } else if (e.message.indexOf('insufficient priority') !== -1) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE_OR_MORE_FEE');
      } else if (e.message.indexOf('dust') !== -1) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_DUST');
      } else if (
        e.message.indexOf('bad-txns-inputs-spent') !== -1 ||
        e.message.indexOf('txn-mempool-conflict') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (
        e.message.indexOf('min relay fee not met') !== -1 ||
        e.message.indexOf('fee for relay') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE');
      } else if (
        e.message.indexOf('insufficient fee, rejecting replacement') !== -1
      ) {
        throw new Error(
          'SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE_FOR_REPLACEMENT'
        );
      } else if (e.message.indexOf('insufficient fee') !== -1) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE');
      } else if (e.message.indexOf('too-long-mempool-chain') !== -1) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else {
        e.message += ' link: ' + link;
        throw e;
      }
    }
    if (typeof res.data === 'undefined' || !res.data) {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }

    const transactionHash = res.data;
    logData = await this._checkSuccess(
      transactionHash,
      hex,
      subtitle,
      txRBF,
      logData
    );

    return { transactionHash, transactionJson: {}, logData };
  }
}
