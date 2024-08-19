import { Wallet } from '@models/Wallet';
import { CryptoCurrencyCode, DatabaseTable, WalletMetadata } from '@appTypes';
import AirDAOKeysStorage from '@lib/crypto/AirDAOKeysStorage';
import {
  AccountDB,
  AccountDBModel,
  Database,
  WalletDB,
  WalletDBModel
} from '@database';
import AirDAOKeysForRef from '@lib/crypto/AirDAOKeysForRef';
import { MnemonicUtils } from './mnemonics';
import { CashBackUtils } from './cashback';
import { Cache, CacheKey } from '../lib/cache';
import { AccountUtils } from './account';
import { CryptoUtils } from './crypto';
import { API } from '@api/api';

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
  let walletInDb: WalletDBModel | null = null;
  let accountInDb: AccountDBModel | null = null;
  try {
    const number = await _getWalletNumber();
    const name = await _getWalletName();
    const hash = await _saveWallet({ mnemonic, name, number });
    const fullWallet: Wallet = new Wallet({
      hash,
      name,
      number
    });
    // get wallet info from network
    const { cashbackToken } = await CashBackUtils.getByHash(hash);
    fullWallet.cashback = cashbackToken;
    const _account = await AirDAOKeysForRef.discoverPublicAndPrivate({
      mnemonic: mnemonic
    });
    const currencyCode = CryptoCurrencyCode.AMB; // TODO this needs to be changed if we support multiple currencies
    // create wallet in db
    walletInDb = await WalletDB.createWallet(fullWallet);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, accountInDbResult] = await Promise.all([
      // securely store private key
      Cache.setItem(
        `${CacheKey.WalletPrivateKey}-${fullWallet.hash}`,
        _account.privateKey
      ),
      // create account in db
      AccountUtils.createAccountInDB(
        _account.address,
        fullWallet.hash,
        _account.path,
        _account.index,
        currencyCode
      )
    ]);
    accountInDb = accountInDbResult;
    // subscribe to notifications
    API.watcherService.watchAddresses([_account.address]);
    return { hash };
  } catch (error) {
    if (walletInDb) walletInDb.destroyPermanently();
    if (accountInDb) accountInDb.destroyPermanently();
    throw error;
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

export const importWalletViaPrivateKey = async (
  privateKey: string,
  accounts: AccountDBModel[]
) => {
  let walletInDb: WalletDBModel | null = null;
  let accountInDb: AccountDBModel | null = null;
  const currencyCode = CryptoCurrencyCode.AMB;

  try {
    const number = await _getWalletNumber();
    const name = await _getWalletName();
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

    const _account = await AirDAOKeysForRef.discoverAccountViaPrivateKey(
      privateKey
    );

    if (!_account) throw new Error();

    walletInDb = await WalletDB.createWallet(fullWallet);
    const [, accountInDbResult] = await Promise.all([
      // Securely store private key
      Cache.setItem(
        `${CacheKey.WalletPrivateKey}-${fullWallet.hash}`,
        privateKey
      ),
      // Create account in DB
      AccountUtils.createAccountInDB(
        _account.address,
        fullWallet.hash,
        _account.path,
        _account.index,
        currencyCode
      )
    ]);

    accountInDb = accountInDbResult;

    await API.watcherService.watchAddresses([_account.address]);
    return { hash, address: _account.address };
  } catch (error) {
    const _account = await AirDAOKeysForRef.discoverAccountViaPrivateKey(
      privateKey
    );

    if (AccountUtils.isWalletAreadyExist(_account.address, accounts)) {
      if (walletInDb) walletInDb.destroyPermanently();
      if (accountInDb) accountInDb.destroyPermanently();
      throw error;
    }
  }
};

export const WalletUtils = {
  processWallet,
  changeSelectedWallet,
  deleteWalletWithAccounts,
  importWalletViaPrivateKey
};
