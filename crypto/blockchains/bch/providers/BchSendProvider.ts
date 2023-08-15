/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import AirDAOAxios from '../../../common/AirDAOAxios';
import DogeSendProvider from '../../doge/providers/DogeSendProvider';

export default class BchSendProvider
  extends DogeSendProvider
  implements AirDAOBlockchainTypes.SendProvider
{
  _apiPath = 'https://rest.bitcoin.com/v2/rawtransactions/sendRawTransaction/';

  async sendTx(
    hex: string,
    subtitle: string,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' BchSendProvider.sendTx ' +
        subtitle +
        ' started ' +
        subtitle
    );

    try {
      const trezor = await super.sendTx(hex, subtitle, txRBF, logData);
      if (trezor) {
        return trezor;
      }
    } catch (error) {
      const e = error as unknown as any;
      if (e.message.indexOf('SERVER_RESPONSE_') !== -1) {
        throw e;
      } else {
        // do nothing
      }
    }

    let res;
    try {
      res = (await AirDAOAxios.get(this._apiPath + hex)) as any;
    } catch (error) {
      const e = error as unknown as any;
      if (e.message.indexOf('dust') !== -1) {
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
    if (typeof res.data === 'undefined' || !res.data) {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }
    return { transactionHash: res.data, transactionJson: {} };
  }
}