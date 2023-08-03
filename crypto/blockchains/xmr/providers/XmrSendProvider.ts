/**
 * @version 0.11
 */
// @ts-ignore
import settingsActions from '../../../../app/appstores/Stores/Settings/SettingsActions';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BlocksoftCryptoLog from '../../../common/BlocksoftCryptoLog';

interface SendParams {
  address: string;
  privViewKey: string;
  tx: string;
}

interface BlocksoftAxiosResponse {
  data: {
    message: string;
    double_spend?: boolean;
    fee_too_low?: boolean;
    overspend?: boolean;
    status?: string;
  };
  message?: string;
}

export default class XmrSendProvider {
  private _settings: any;
  private _link: string | undefined;
  private _serverUrl: string;

  constructor(settings: any) {
    this._settings = settings;
    this._link = undefined;
    this._serverUrl = 'api.mymonero.com:8443';
  }

  private async _init(): Promise<void> {
    if (this._link !== undefined) {
      return;
    }

    const serverUrl = await settingsActions.getSetting('xmrServerSend');
    if (serverUrl && serverUrl !== 'false') {
      this._serverUrl = serverUrl.trim();
    }

    let link = this._serverUrl;
    if (!link.startsWith('http')) {
      link = `https://${this._serverUrl}`;
    }

    if (!link.endsWith('/')) {
      link += '/';
    }

    this._link = link;
  }

  public async send(params: SendParams): Promise<any> {
    await this._init();

    try {
      let resNode: BlocksoftAxiosResponse;

      if (this._link?.includes('mymonero.com')) {
        // @ts-ignore
        resNode = await BlocksoftAxios.post(this._link + 'submit_raw_tx', {
          address: params.address,
          view_key: params.privViewKey,
          tx: params.tx
        });
      } else {
        // @ts-ignore
        resNode = await BlocksoftAxios.post(
          this._link + 'send_raw_transaction',
          {
            tx_as_hex: params.tx,
            do_not_relay: false
          }
        );
      }

      BlocksoftCryptoLog.log(
        `'XmrSendProvider node ${this._link},' +
        ${resNode.data}`
      );
      const responseData = resNode.data;

      if (typeof responseData !== 'object') {
        throw new Error('SERVER_RESPONSE_NOT_VALID');
      }

      if (responseData.double_spend) {
        throw new Error('SERVER_RESPONSE_DOUBLE_SPEND');
      }

      if (responseData.fee_too_low) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_AS_FEE');
      }

      if (responseData.overspend) {
        throw new Error('SERVER_RESPONSE_TOO_BIG_FEE_FOR_TRANSACTION');
      }

      if (responseData.status === 'Failed') {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (e: any) {
      if (e.message.includes('double')) {
        throw new Error('SERVER_RESPONSE_DOUBLE_SPEND');
      } else {
        throw e;
      }
    }
  }
}
