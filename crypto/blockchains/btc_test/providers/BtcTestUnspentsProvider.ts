/**
 * @version 0.52
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

import AirDAOCryptoLog from '@crypto/common/AirDAOCryptoLog';
import AirDAOAxios from '@crypto/common/AirDAOAxios';

const API_PATH = 'https://blockstream.info/testnet/api/';

export default class BtcTestUnspentsProvider
  implements AirDAOBlockchainTypes.UnspentsProvider
{
  protected _settings: AirDAOBlockchainTypes.CurrencySettings;

  constructor(
    settings: AirDAOBlockchainTypes.CurrencySettings,
    serverCode: string
  ) {
    this._settings = settings;
  }

  /**
   * https://blockstream.info/testnet/api/address/mtU4mYXfBRiTx1iUBWcCvUTr4CgRnRALaL/utxo
   * @param address
   */
  async getUnspents(
    address: string
  ): Promise<AirDAOBlockchainTypes.UnspentTx[]> {
    // @ts-ignore
    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' BtcTestUnspentsProvider.getUnspents started',
      address
    );

    const link = API_PATH + `address/${address}/utxo`;
    const res = await AirDAOAxios.getWithoutBraking(link);

    if (!res || typeof res.data === 'undefined') {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' BtcTestUnspentsProvider.getUnspents nothing loaded for address ' +
          address +
          ' link ' +
          link
      );
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }
    if (
      !res.data ||
      typeof res.data.length === 'undefined' ||
      !res.data ||
      !res.data.length
    ) {
      return [];
    }
    const sortedUnspents = [];
    /**
     * @param {*} res.data[]
     * @param {string} res.data[].txid
     * @param {string} res.data[].vout
     * @param {string} res.data[].status
     * @param {string} res.data[].status.confirmed
     * @param {string} res.data[].status.block_height
     * @param {string} res.data[].status.block_hash
     * @param {string} res.data[].status.block_time
     * @param {string} res.data[].value
     */
    for (const unspent of res.data) {
      sortedUnspents.push({
        txid: unspent.txid,
        vout: typeof unspent.vout === 'undefined' ? 0 : unspent.vout,
        value: unspent.value.toString(),
        height: 0,
        confirmations:
          typeof unspent.status !== 'undefined' &&
          typeof unspent.status.confirmed !== 'undefined' &&
          unspent.status.confirmed
            ? 100
            : 0,
        isRequired: false
      });
    }
    return sortedUnspents;
  }
}
