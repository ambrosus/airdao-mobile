import { DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { WalletDBModel } from '@database/models';
import { Q } from '@nozbe/watermelondb';

const walletsDb = DatabaseTable.Wallets;

interface Wallet {
  name: string;
  hash: string;
  number: number;
  cashback: string;
  isBackedUp: number;
  isHideTransactionForFee: number;
  allowReplaceByFee: number;
  useLegacy: number;
  useUnconfirmed: number;
  isHd: number;
  isCreatedHere: number;
  toSendStatus: number;
}

export class WalletDB {
  static async getWalletByHash(hash: string): Promise<WalletDBModel | null> {
    const wallets = (await Database.query(
      walletsDb,
      Q.where('hash', Q.eq(hash))
    )) as WalletDBModel[];
    if (wallets?.length > 0) return wallets[0];
    return null;
  }

  static async createWallet(wallet: Wallet) {
    const walletInDB = await this.getWalletByHash(wallet.hash);
    if (!walletInDB) {
      return (await Database.createModel(walletsDb, wallet)) as WalletDBModel;
    }
    return walletInDB;
  }

  static async updateWalletByHash(
    hash: string,
    updateObj: Partial<WalletDBModel>
  ) {
    const wallet = await this.getWalletByHash(hash);
    if (!wallet) {
      console.error('WalletDB --> could not find wallet by hash --> ', {
        hash
      });
      throw Error('Could not find wallet by hash');
    }
    return await Database.updateModel(walletsDb, wallet.id, updateObj);
  }

  static async deleteWallet(hash: string) {
    const wallet = await this.getWalletByHash(hash);
    if (wallet) return await Database.deleteModel(walletsDb, wallet.id);
  }
}
