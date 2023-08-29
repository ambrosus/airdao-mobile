import { Database } from '@database';
import { DatabaseTable } from '@appTypes';
import { WalletUtils } from '@utils/wallet';

const addAccountInfoToDatabase = async (walletMnemonic: string) => {
  try {
    const { address } = await WalletUtils.processWallet({
      number: 0,
      mnemonic: walletMnemonic,
      name: ''
    });

    const accountInfo = {
      address,
      name: '',
      derivationPath: 'm/44/60/0/0/0',
      derivationIndex: 0,
      derivationType: '',
      alreadyShown: 0,
      walletPubId: 0,
      status: 0,
      isMain: 0,
      transactionsScanTime: 0,
      transactionsScanLog: '',
      transactionsScanError: '',
      changesLog: '',
      currencyCode: 'AMB'
    };

    await Database.createModel(DatabaseTable.Accounts, accountInfo);
  } catch (error) {
    console.log(error, 'error');
  }
};
export const AccountUtils = { addAccountInfoToDatabase };
