/**
 * @version 0.20
 */

import DogeTransferProcessor from '../doge/DogeTransferProcessor';
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';

export default class BtgTransferProcessor
  extends DogeTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  /**
   * @type {string}
   * @private
   */
  _trezorServerCode = 'BTG_TREZOR_SERVER';

  _builderSettings: AirDAOBlockchainTypes.BuilderSettings = {
    minOutputDustReadable: 0.00001,
    minChangeDustReadable: 0.00001,
    feeMaxForByteSatoshi: 10000, // for tx builder
    feeMaxAutoReadable2: 1, // for fee calc,
    feeMaxAutoReadable6: 0.5, // for fee calc
    feeMaxAutoReadable12: 0.2, // for fee calc
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
}
