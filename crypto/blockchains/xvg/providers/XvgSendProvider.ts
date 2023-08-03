/**
 * @version 0.20
 */
import BlocksoftCryptoLog from '../../../common/BlocksoftCryptoLog';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

export default class XvgSendProvider
  implements AirDAOBlockchainTypes.SendProvider
{
  protected _settings: AirDAOBlockchainTypes.CurrencySettings;

  constructor(settings: AirDAOBlockchainTypes.CurrencySettings) {
    this._settings = settings;
  }

  async sendTx(
    hex: string,
    subtitle: string
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    const link = BlocksoftExternalSettings.getStatic('XVG_SEND_LINK');
    BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' XvgSendProvider.sendTx ' +
        subtitle +
        ' started ' +
        subtitle +
        ' ' +
        link
    );
    let res;
    try {
      res = await BlocksoftAxios.post(link, { rawTx: hex });
      BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' XvgSendProvider.sendTx ' +
          subtitle +
          ' error ' +
          subtitle +
          ' ok ' +
          hex
      );
    } catch (e: any) {
      BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' XvgSendProvider.sendTx ' +
          subtitle +
          ' error ' +
          subtitle +
          ' ' +
          e.message +
          ' ' +
          hex
      );
      if (e.message.indexOf('mandatory-script-verify-flag-failed') !== -1) {
        throw new Error('SERVER_RESPONSE_PLEASE_CHECK_SYSTEM_TIME');
      } else if (e.message.indexOf('dust') !== -1) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_DUST');
      } else if (e.message.indexOf('missing inputs') !== -1) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (e.message.indexOf('bad-txns-inputs-spent') !== -1) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (e.message.indexOf('txn-mempool-conflict') !== -1) {
        throw new Error('SERVER_RESPONSE_NO_RESPONSE');
      } else if (
        e.message.indexOf('fee for relay') !== -1 ||
        e.message.indexOf('insufficient priority') !== -1
      ) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE');
      } else if (e.message.indexOf('rejecting replacement') !== -1) {
        throw new Error(
          'SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE_FOR_REPLACEMENT'
        );
      } else {
        throw e;
      }
    }
    // @ts-ignore
    if (typeof res.data.txid === 'undefined' || !res.data.txid) {
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }
    // @ts-ignore
    return { transactionHash: res.data.txid, transactionJson: {} };
  }
}
