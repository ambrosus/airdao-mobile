/**
 * @version 0.20
 */

import BtcTransferProcessor from '@crypto/blockchains/btc/BtcTransferProcessor';
import DogeNetworkPrices from '@crypto/blockchains/doge/basic/DogeNetworkPrices';
import BtcUnspentsProvider from '@crypto/blockchains/btc/providers/BtcUnspentsProvider';
import DogeSendProvider from '@crypto/blockchains/doge/providers/DogeSendProvider';
import BtcTxInputsOutputs from '@crypto/blockchains/btc/tx/BtcTxInputsOutputs';
import BtcTxBuilder from '@crypto/blockchains/btc/tx/BtcTxBuilder';
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

export default class LtcTransferProcessor
  extends BtcTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  _trezorServerCode = 'LTC_TREZOR_SERVER';

  _builderSettings: AirDAOBlockchainTypes.BuilderSettings = {
    minOutputDustReadable: 0.000005,
    minChangeDustReadable: 0.00001,
    feeMaxForByteSatoshi: 10000, // for tx builder
    feeMaxAutoReadable2: 0.2, // for fee calc,
    feeMaxAutoReadable6: 0.1, // for fee calc
    feeMaxAutoReadable12: 0.05, // for fee calc
    changeTogether: true
  };

  _initProviders() {
    if (this._initedProviders) return false;
    this.unspentsProvider = new BtcUnspentsProvider(
      this._settings,
      this._trezorServerCode
    );
    this.sendProvider = new DogeSendProvider(
      this._settings,
      this._trezorServerCode
    );
    this.txPrepareInputsOutputs = new BtcTxInputsOutputs(
      this._settings,
      this._builderSettings
    );
    this.txBuilder = new BtcTxBuilder(this._settings, this._builderSettings);
    this.networkPrices = new DogeNetworkPrices();
    this._initedProviders = true;
  }

  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction
  ): boolean {
    return false;
  }
}
