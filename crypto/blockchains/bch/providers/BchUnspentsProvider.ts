/**
 * @version 0.20
 *
 * https://developer.bitcoin.com/rest/docs/address
 * https://rest.bitcoin.com/v2/address/utxo/bitcoincash:qz6qh4304stgwpqxp6gwsucma30fewp7z5cs4yuvdf
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftAxios from '../../../common/BlocksoftAxios';
import BtcCashUtils from '../ext/BtcCashUtils';
import DogeUnspentsProvider from '../../doge/providers/DogeUnspentsProvider';

export default class BchUnspentsProvider
  extends DogeUnspentsProvider
  implements AirDAOBlockchainTypes.UnspentsProvider
{
  _apiPath = 'https://rest.bitcoin.com/v2/address/utxo/bitcoincash:';

  async getUnspents(
    address: string
  ): Promise<AirDAOBlockchainTypes.UnspentTx[]> {
    try {
      const trezor = await super.getUnspents('bitcoincash:' + address);
      if (trezor && trezor.length > 0) {
        return trezor;
      }
    } catch (e) {
      // do nothing
    }
    // TODO check if log is necessary @ts-ignore
    // AirDAOCryptoLog.log(
    //   this._settings.currencyCode + ' BchUnspentsProvider.getUnspents started',
    //   address
    // );
    address = BtcCashUtils.fromLegacyAddress(address);
    const link = this._apiPath + address;
    const res = (await BlocksoftAxios.getWithoutBraking(link)) as any;
    if (!res || !res.data || typeof res.data === 'undefined') {
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' BchUnspentsProvider.getUnspents nothing loaded for address ' +
          address +
          ' link ' +
          link
      );
      throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
    }
    if (!res.data || typeof res.data.utxos === 'undefined' || !res.data.utxos) {
      return [];
    }
    const sortedUnspents = [];
    /**
     * https://rest.bitcoin.com/v2/address/utxo/bitcoincash:qz6qh4304stgwpqxp6gwsucma30fewp7z5cs4yuvdf
     * @param {*} res.data.utxos[]
     * @param {string} res.data.utxos[].txid 5be83026d82b56e8df7fa309e0b50132cb5cac228f83103532b20e0c991a3f9b
     * @param {string} res.data.utxos[].vout 1
     * @param {string} res.data.utxos[].amount 0.04373313
     * @param {string} res.data.utxos[].satoshis 4373313
     * @param {string} res.data.utxos[].height 615754
     * @param {string} res.data.utxos[].confirmations
     */
    let unspent;
    for (unspent of res.data.utxos) {
      sortedUnspents.push({
        txid: unspent.txid,
        vout: unspent.vout,
        value: unspent.satoshis.toString(),
        height: unspent.height,
        confirmations: unspent.confirmations,
        isRequired: false
      });
    }

    return sortedUnspents;
  }
}
