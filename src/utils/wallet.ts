import { Wallet } from '@models/Wallet';
import { DatabaseTable, WalletMetadata } from '@appTypes';
import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';
import { Crypto } from './crypto';
import { MnemonicUtils } from './mnemonics';
import { CashBackUtils } from './cashback';
import { Database } from '@database';

const _saveWallet = async (
  wallet: Pick<WalletMetadata, 'newMnemonic' | 'mnemonic' | 'name' | 'number'>
) => {
  let storedKey = '';
  try {
    const prepared = {
      mnemonic: wallet.newMnemonic ? wallet.newMnemonic : wallet.mnemonic,
      hash: '?',
      number: wallet.number,
      name: wallet.name
    };

    prepared.mnemonic = MnemonicUtils.recheckMnemonic(prepared.mnemonic);
    prepared.hash = await Crypto.hashMnemonic(prepared.mnemonic);

    const checkKey = await AirDAOKeysStorage.isMnemonicAlreadySaved(prepared);
    if (checkKey) {
      // // TODO
    }
    storedKey = await AirDAOKeysStorage.saveMnemonic(prepared);
  } catch (e) {}
  return storedKey;
};

const _getWalletNumber = async () => {
  const count = (await Database.getCount(DatabaseTable.Wallets)) || 0;
  return count + 1;
};

const _getWalletName = async () => {
  const idx = await _getWalletNumber();
  return 'AirDAO Wallet #' + idx;
};

const processWallet = async (
  data: Pick<WalletMetadata, 'mnemonic' | 'name' | 'number'>
) => {
  const hash = await _saveWallet(data); // done
  let tmpWalletName = data.name;

  if (!tmpWalletName || tmpWalletName === '') {
    tmpWalletName = await _getWalletName();
  }
  const number = await _getWalletNumber();
  const fullWallet: Wallet = new Wallet({
    hash,
    ...data,
    name: tmpWalletName,
    number
  });
  const { tmpPublicAndPrivateResult, cashbackToken } =
    await CashBackUtils.getByHash(hash);
  fullWallet.cashback = cashbackToken;
  await Wallet.saveWallet(fullWallet);
  try {
  } catch (error) {
    throw error;
  }
  const { address } = tmpPublicAndPrivateResult;
  return { address };
};

export const WalletUtils = { processWallet };
