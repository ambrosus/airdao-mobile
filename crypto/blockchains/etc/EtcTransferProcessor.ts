/**
 * @author Ksu
 * @version 0.43
 */
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';
// import BnbSmartTransferProcessor from '@crypto/blockchains/bnb_smart/BnbSmartTransferProcessor';

export default class EtcTransferProcessor
  // extends BnbSmartTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction,
    source: string
  ): boolean {
    return false;
  }

  getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData?: AirDAOBlockchainTypes.TransferAdditionalData
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    return Promise.resolve(undefined);
  }

  getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData?: AirDAOBlockchainTypes.TransferAdditionalData
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    return Promise.resolve(undefined);
  }

  needPrivateForFee(): boolean {
    return false;
  }

  sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    return Promise.resolve(undefined);
  }
}
