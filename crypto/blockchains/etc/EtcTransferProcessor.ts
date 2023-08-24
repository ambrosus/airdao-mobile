/**
 * @author Ksu
 * @version 0.43
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
import BnbSmartTransferProcessor from '@crypto/blockchains/bnb_smart/BnbSmartTransferProcessor';

export default class EtcTransferProcessor
  extends BnbSmartTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction,
    source: string
  ): boolean {
    return false;
  }
}
