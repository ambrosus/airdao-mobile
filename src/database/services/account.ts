import { DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { AccountDBModel, WalletDBModel } from '@database/models';
import { Q } from '@nozbe/watermelondb';
import { WalletDB } from './wallet';

const accountsDb = DatabaseTable.Accounts;

interface Account {
  address: string;
  walletHash: string;
  name: string;
  derivationPath: string;
  derivationIndex: number;
  derivationType: string;
  alreadyShown: number;
  walletPubId: number;
  status: number;
  isMain: number;
  transactionsScanTime: number;
  transactionsScanLog: string;
  transactionsScanError: string;
  changesLog: string;
  currencyCode: string;
}

export class AccountDB {
  static async getAccountByAddress(
    address: string
  ): Promise<AccountDBModel | null> {
    const accounts = (await Database.query(
      accountsDb,
      Q.where('address', Q.eq(address))
    )) as AccountDBModel[];
    if (accounts.length > 0) return accounts[0];
    return null;
  }

  static async getAccountsOfWallet(hash: string): Promise<AccountDBModel[]> {
    const wallet = await WalletDB.getWalletByHash(hash);
    if (!wallet) {
      console.error('AccountDB --> could not find wallet by hash --> ', {
        hash
      });
      throw Error('AccountDB --> Could not find wallet by hash');
    }
    return (await Database.query(
      accountsDb,
      Q.where('hash', wallet.id)
    )) as AccountDBModel[];
  }

  static async createAccount(account: Account, updateIfExists = false) {
    try {
      const wallet = await WalletDB.getWalletByHash(account.walletHash);
      if (!wallet) throw Error('Could not find wallet for given account');
      const accountInDb = await this.getAccountByAddress(account.address);
      let finalAccount: AccountDBModel;
      let canUpdateRelation = false;
      if (accountInDb && updateIfExists) {
        finalAccount = (await this.updateAccount(
          accountInDb.address,
          account
        )) as AccountDBModel;
        canUpdateRelation = true;
      } else {
        finalAccount = (await Database.createModel(
          accountsDb,
          account
        )) as AccountDBModel;
        canUpdateRelation = true;
      }
      if (!finalAccount?.wallet?.hash && canUpdateRelation) {
        await Database.updateRelation<AccountDBModel, WalletDBModel>(
          finalAccount,
          wallet,
          'wallet'
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateAccount(
    address: string,
    updateObj: Partial<AccountDBModel>
  ) {
    const account = await this.getAccountByAddress(address);
    if (!account) {
      console.error('AccountDB --> could not find account by address --> ', {
        address
      });
      throw Error('Could not find account by address');
    }
    return await Database.updateModel(accountsDb, account.id, updateObj);
  }

  static async deleteAccount(address: string) {
    const account = await this.getAccountByAddress(address);
    if (account) return await Database.deleteModel(accountsDb, account.id);
  }

  static async deleteAccountsOfWallet(walletHash: string) {
    const accountsByWalletHash = await this.getAccountsOfWallet(walletHash);
    await Database.deleteMultiple(accountsByWalletHash);
  }
}
