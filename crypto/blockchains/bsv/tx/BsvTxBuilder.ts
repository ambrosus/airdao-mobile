/**
 * @version 0.5
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import DogeTxBuilder from '../../doge/tx/DogeTxBuilder';
import BtcCashUtils from '../../bch/ext/BtcCashUtils';
import { ECPair, payments, TransactionBuilder } from 'bitcoinjs-lib';

export default class BsvTxBuilder
  extends DogeTxBuilder
  implements AirDAOBlockchainTypes.TxBuilder
{
  _getRawTxValidateKeyPair(
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    data: AirDAOBlockchainTypes.TransferData
  ): void {
    this.keyPair = false;
    try {
      this.keyPair = ECPair.fromWIF(
        privateData.privateKey,
        this._bitcoinNetwork
      );
      const address = payments.p2pkh({
        pubkey: this.keyPair.publicKey,
        network: this._bitcoinNetwork
      }).address;
      const legacyAddress = BtcCashUtils.toLegacyAddress(data.addressFrom);
      if (address !== data.addressFrom && address !== legacyAddress) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'not valid signing address ' +
            data.addressFrom +
            ' != ' +
            address +
            ' != ' +
            legacyAddress
        );
      }
    } catch (e) {
      e.message += ' in privateKey BSV signature check ';
      throw e;
    }
  }

  _getRawTxAddOutput(
    txb: TransactionBuilder,
    output: AirDAOBlockchainTypes.OutputTx
  ): void {
    const to = BtcCashUtils.toLegacyAddress(output.to);
    txb.addOutput(to, output.amount * 1);
  }
}
