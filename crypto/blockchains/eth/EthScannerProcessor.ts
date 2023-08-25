/**
 * @version 0.5
 */
import BlocksoftUtils from '../../common/AirDAOUtils';
import AirDAOAxios from '../../common/AirDAOAxios';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import EthBasic from './basic/EthBasic';
import AirDAOExternalSettings from '../../common/AirDAOExternalSettings';

export default class EthScannerProcessor extends EthBasic {
  /**
   * @param {string} txHash
   * @return {Promise<[UnifiedTransaction]>}
   */
  async getTransactionBlockchain(txHash: string | boolean) {
    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' EthScannerProcessor.getTransaction started ' +
        txHash
    );

    this._trezorServer = await AirDAOExternalSettings.getTrezorServer(
      this._trezorServerCode,
      this._settings.currencyCode + ' ETH.Scanner.getTransaction'
    );

    if (typeof this._trezorServer === 'undefined') {
      AirDAOCryptoLog.err(
        this._settings.currencyCode +
          ' EthScannerProcessor.getTransaction empty trezorServer'
      );
      throw new Error(
        this._settings.currencyCode +
          ' EthScannerProcessor.getTransaction empty trezorServer'
      );
    }

    if (!this._trezorServer) {
      return false;
    }

    let link = this._trezorServer + '/api/v2/tx-specific/' + txHash;
    let res = await AirDAOAxios.getWithoutBraking(link);

    if (!res || !res.data) {
      AirDAOExternalSettings.setTrezorServerInvalid(
        this._trezorServerCode,
        this._trezorServer
      );
      this._trezorServer = await AirDAOExternalSettings.getTrezorServer(
        this._trezorServerCode,
        this._settings.currencyCode + ' ETH.Scanner._get'
      );
      if (typeof this._trezorServer === 'undefined') {
        AirDAOCryptoLog.err(
          this._settings.currencyCode +
            ' EthScannerProcessor._get empty trezorServer2'
        );
        throw new Error(
          this._settings.currencyCode +
            ' EthScannerProcessor._get empty trezorServer2'
        );
      }
      link = this._trezorServer + '/api/v2/tx-specific/' + txHash;
      res = await AirDAOAxios.getWithoutBraking(link);
      if (!res || !res.data) {
        AirDAOExternalSettings.setTrezorServerInvalid(
          this._trezorServerCode,
          this._trezorServer
        );
        return false;
      }
    }

    if (typeof res.data.tx === 'undefined') {
      return false;
    }

    let tx;
    if (typeof res.data.receipt === 'undefined') {
      tx = { ...{ status: 0x0 }, ...res.data.tx };
    } else {
      tx = { ...res.data.receipt, ...res.data.tx };
    }

    tx.nonce = BlocksoftUtils.hexToDecimal(tx.nonce);
    if (tx.nonce * 1 === 0) {
      tx.nonce = 0;
    }
    tx.status = BlocksoftUtils.hexToDecimal(tx.status);
    tx.gas = BlocksoftUtils.hexToDecimal(tx.gas);
    tx.gasPrice = BlocksoftUtils.hexToDecimal(tx.gasPrice);
    tx.gasUsed = BlocksoftUtils.hexToDecimal(tx.gasUsed);
    return tx;
  }
}
