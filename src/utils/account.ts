import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { AccountDB } from '@database';

const createAccountInDB = async (
  address: string,
  walletHash: string,
  derivationPath: string,
  index: number,
  currencyCode: AirDAODictTypes.Code
) => {
  try {
    const account = {
      address,
      walletHash,
      name: '',
      derivationPath,
      derivationIndex: index,
      derivationType: '',
      alreadyShown: 0,
      walletPubId: 0,
      status: 0,
      isMain: 0,
      transactionsScanTime: 0,
      transactionsScanLog: '',
      transactionsScanError: '',
      changesLog: '',
      currencyCode
    };
    return await AccountDB.createAccount(account, true);
  } catch (error) {
    throw error;
  }
};
export const AccountUtils = { createAccountInDB };
