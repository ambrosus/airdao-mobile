/**
 * @version 0.5
 */
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';
import DogeTransferProcessor from '../doge/DogeTransferProcessor';
import DogeTxInputsOutputs from '../doge/tx/DogeTxInputsOutputs';
import BsvTxBuilder from './tx/BsvTxBuilder';
import BsvUnspentsProvider from './providers/BsvUnspentsProvider';
import BsvSendProvider from '@crypto/blockchains/bsv/providers/BsvSendProvider';

export default class BsvTransferProcessor
  extends DogeTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  _trezorServerCode = '';

  _builderSettings: AirDAOBlockchainTypes.BuilderSettings = {
    minOutputDustReadable: 0.000005,
    minChangeDustReadable: 0.00001,
    feeMaxForByteSatoshi: 10000, // for tx builder
    feeMaxAutoReadable2: 0.2, // for fee calc,
    feeMaxAutoReadable6: 0.1, // for fee calc
    feeMaxAutoReadable12: 0.05, // for fee calc
    changeTogether: true,
    minRbfStepSatoshi: 10,
    minSpeedUpMulti: 1.5
  };

  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction
  ): boolean {
    return false;
  }

  _initProviders() {
    if (this._initedProviders) return false;
    this.unspentsProvider = new BsvUnspentsProvider(
      this._settings,
      this._trezorServerCode
    );
    this.sendProvider = new BsvSendProvider(
      this._settings,
      this._trezorServerCode
    );
    this.txPrepareInputsOutputs = new DogeTxInputsOutputs(
      this._settings,
      this._builderSettings
    );
    this.txBuilder = new BsvTxBuilder(this._settings, this._builderSettings);
    this._initedProviders = true;
  }
}
