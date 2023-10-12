import { Wallet } from '@models/Wallet';
import { DatabaseTable, WalletMetadata } from '@appTypes';
import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';
import { Database, WalletDB, AccountDB } from '@database';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { MnemonicUtils } from './mnemonics';
import { CashBackUtils } from './cashback';
import { Cache, CacheKey } from './cache';
import { AccountUtils } from './account';
import { Crypto } from './crypto';
import { API } from '@api/api';

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
      // TODO
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

const processWallet = async (mnemonic: string) => {
  const number = await _getWalletNumber();
  const name = await _getWalletName();
  const hash = await _saveWallet({ mnemonic, name, number });
  const fullWallet: Wallet = new Wallet({
    hash,
    mnemonic,
    name,
    number
  });
  // get wallet info from network
  const { cashbackToken } = await CashBackUtils.getByHash(hash);
  fullWallet.cashback = cashbackToken;
  const _account = await AirDAOKeysForRef.discoverPublicAndPrivate({
    mnemonic: mnemonic
  });
  // create wallet in db
  await WalletDB.createWallet(fullWallet);
  // create account in db
  const currencyCode = AirDAODictTypes.Code.AMB; // TODO this needs to be changed if we support multiple currencies
  await AccountUtils.createAccountInDB(
    _account.address,
    fullWallet.hash,
    _account.path,
    _account.index,
    currencyCode
  );
  // subscribe to notifications
  API.watcherService.watchAddresses([_account.address]);
  return { hash };
};

const changeSelectedWallet = async (hash: string) => {
  await Cache.setItem(CacheKey.SelectedWallet, hash);
};

const deleteWalletWithAccounts = async (hash: string) => {
  await AccountDB.deleteAccountsOfWallet(hash);
  await WalletDB.deleteWallet(hash);
  // delete active wallet
  const activeWalletHash = await Cache.getItem(CacheKey.SelectedWallet);
  if (activeWalletHash === hash) {
    await Cache.deleteItem(CacheKey.SelectedWallet);
  }
};

export const WalletUtils = {
  processWallet,
  changeSelectedWallet,
  deleteWalletWithAccounts
};
