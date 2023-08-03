/**
 * @version 0.20
 * https://github.com/trezor/blockbook/blob/master/docs/api.md
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';

export default class DogeSendProvider
  implements AirDAOBlockchainTypes.SendProvider
{
  protected _trezorServerCode = '';

  private _trezorServer = '';

  protected _settings: AirDAOBlockchainTypes.CurrencySettings;

  constructor(
    settings: AirDAOBlockchainTypes.CurrencySettings,
    serverCode: string
  ) {
    this._settings = settings;
    this._trezorServerCode = serverCode;
  }

  async _check(hex: string, subtitle: string, txRBF: any, logData: any) {
    return {};
  }

  async _checkError(hex: string, subtitle: string, txRBF: any, logData: any) {
    return {};
  }

  async _checkSuccess(
    transactionHash: string,
    hex: string,
    subtitle: string,
    txRBF: any,
    logData: any
  ) {
    return {};
  }

  async sendTx(
    hex: string,
    subtitle: string,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' DogeSendProvider.sendTx ' +
        subtitle +
        ' started ',
      logData
    );

    let link = BlocksoftExternalSettings.getStatic(
      this._trezorServerCode + '_SEND_LINK'
    );
    if (!link || link === '') {
      this._trezorServer = await BlocksoftExternalSettings.getTrezorServer(
        this._trezorServerCode,
        'DOGE.Send.sendTx'
      );
      link = this._trezorServer + '/api/v2/sendtx/';
    }

    logData = await this._check(hex, subtitle, txRBF, logData);

    let res;
    try {
      res = await BlocksoftAxios.post(link, hex);
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
        await BlocksoftExternalSettings.setTrezorServerInvalid(
          this._trezorServerCode,
          this._trezorServer
        );
        e.message += ' link: ' + link;
        throw e;
      }
    }
    if (typeof res.data.result === 'undefined' || !res.data.result) {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }

    const transactionHash = res.data.result;
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
