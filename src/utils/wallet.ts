import { API } from '@api/api';
import { CryptoCurrencyCode, DatabaseTable, WalletMetadata } from '@appTypes';
import {
  AccountDB,
  AccountDBModel,
  Database,
  WalletDB,
  WalletDBModel
} from '@database';
import AirDAOKeysForRef from '@lib/crypto/AirDAOKeysForRef';
import { singleAirDAOStorage } from '@lib/crypto/AirDAOKeysStorage';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { Wallet } from '@models/Wallet';
import { AccountUtils } from './account';
import { CashBackUtils } from './cashback';
import { CryptoUtils } from './crypto';
import { MnemonicUtils } from './mnemonics';
import { Cache, CacheKey } from '../lib/cache';

const _saveWallet = async (
  wallet: Pick<WalletMetadata, 'newMnemonic' | 'name' | 'number'> & {
    mnemonic: string;
  },
  isPrivateKey = false
) => {
  let storedKey = '';
  try {
    const prepared = {
      mnemonic: wallet.newMnemonic ? wallet.newMnemonic : wallet.mnemonic,
      hash: '?',
      number: wallet.number,
      name: wallet.name
    };

    prepared.mnemonic = isPrivateKey
      ? wallet.mnemonic
      : MnemonicUtils.recheckMnemonic(prepared.mnemonic);
    prepared.hash = await CryptoUtils.hashMnemonic(prepared.mnemonic);

    const checkKey = await singleAirDAOStorage.isMnemonicAlreadySaved(prepared);
    if (checkKey) {
      // TODO
    }
    storedKey = await singleAirDAOStorage.saveMnemonic(prepared);
  } catch (e) {}
  return storedKey;
};

const _getWalletNumber = async () => {
  const count = (await Database.getCount(DatabaseTable.Wallets)) || 0;
  return count + 1;
};

const processWallet = async (mnemonic: string, accounts: AccountDBModel[]) => {
  let walletInDb: WalletDBModel | null = null;
  let accountInDb: AccountDBModel | null = null;
  const currencyCode = CryptoCurrencyCode.AMB;

  try {
    const number = await _getWalletNumber();
    const name = '';
    const hash = await _saveWallet({ mnemonic, name, number });
    const fullWallet: Wallet = new Wallet({
      hash,
      name,
      number,
      cashback: await CashBackUtils.getByHash(hash)
    });

    // Check if wallet already exists in accounts
    const { address, index, path, privateKey } =
      await AirDAOKeysForRef.discoverPublicAndPrivate({
        mnemonic
      });

    if (AccountUtils.isWalletAlreadyExist(address, accounts)) {
      throw new Error('400: Wallet already exists');
    }

    // create wallet in db
    walletInDb = await WalletDB.createWallet(fullWallet);
    const [, accountInDbResult] = await Promise.all([
      // Securely store private key
      Cache.setItem(
        `${CacheKey.WalletPrivateKey}-${fullWallet.hash}`,
        privateKey
      ),
      // Create account in db
      AccountUtils.createAccountInDB(
        address,
        fullWallet.hash,
        path,
        index,
        currencyCode
      )
    ]);
    sendFirebaseEvent(CustomAppEvents.main_add_wallet);

    accountInDb = accountInDbResult;

    await API.watcherService.watchAddresses([address]);
    return { hash, address };
  } catch (error) {
    const { address } = await AirDAOKeysForRef.discoverPublicAndPrivate({
      mnemonic
    });

    if (AccountUtils.isWalletAlreadyExist(address, accounts)) {
      if (walletInDb) walletInDb.destroyPermanently();
      if (accountInDb) accountInDb.destroyPermanently();
      throw error;
    }
  }
};

export const importWalletViaPrivateKey = async (
  privateKey: string,
  accounts: AccountDBModel[]
) => {
  let walletInDb: WalletDBModel | null = null;
  let accountInDb: AccountDBModel | null = null;
  const currencyCode = CryptoCurrencyCode.AMB;

  try {
    const number = await _getWalletNumber();
    const name = '';
    const hash = await _saveWallet(
      { mnemonic: privateKey, name, number },
      true
    );

    const fullWallet: Wallet = new Wallet({
      hash,
      name,
      number,
      cashback: await CashBackUtils.getByHash(hash)
    });

    const { address, index, path } =
      await AirDAOKeysForRef.discoverAccountViaPrivateKey(privateKey);

    if (!address) throw new Error();

    walletInDb = await WalletDB.createWallet(fullWallet);
    const [, accountInDbResult] = await Promise.all([
      // Securely store private key
      Cache.setItem(
        `${CacheKey.WalletPrivateKey}-${fullWallet.hash}`,
        privateKey
      ),
      // Create account in DB
      AccountUtils.createAccountInDB(
        address,
        fullWallet.hash,
        path,
        index,
        currencyCode
      )
    ]);
    sendFirebaseEvent(CustomAppEvents.main_add_wallet);

    accountInDb = accountInDbResult;

    await API.watcherService.watchAddresses([address]);
    return { hash, address };
  } catch (error) {
    const { address } = await AirDAOKeysForRef.discoverAccountViaPrivateKey(
      privateKey
    );

    if (AccountUtils.isWalletAlreadyExist(address, accounts)) {
      if (walletInDb) walletInDb.destroyPermanently();
      if (accountInDb) accountInDb.destroyPermanently();
      throw error;
    }
  }
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
  deleteWalletWithAccounts,
  importWalletViaPrivateKey
};
