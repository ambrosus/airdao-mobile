/**
 * @version 0.52
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import DogeTransferProcessor from '@crypto/blockchains/doge/DogeTransferProcessor';
import BtcTestUnspentsProvider from '@crypto/blockchains/btc_test/providers/BtcTestUnspentsProvider';
import BtcTestSendProvider from '@crypto/blockchains/btc_test/providers/BtcTestSendProvider';
import DogeTxInputsOutputs from '@crypto/blockchains/doge/tx/DogeTxInputsOutputs';
import DogeTxBuilder from '@crypto/blockchains/doge/tx/DogeTxBuilder';

export default class BtcTestTransferProcessor
  extends DogeTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  _trezorServerCode = 'NONE';

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
    this.unspentsProvider = new BtcTestUnspentsProvider(
      this._settings,
      this._trezorServerCode
    );
    this.sendProvider = new BtcTestSendProvider(
      this._settings,
      this._trezorServerCode
    );
    this.txPrepareInputsOutputs = new DogeTxInputsOutputs(
      this._settings,
      this._builderSettings
    );
    this.txBuilder = new DogeTxBuilder(this._settings, this._builderSettings);
    this._initedProviders = true;
  }
}
