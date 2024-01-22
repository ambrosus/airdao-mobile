import { CacheableAccount, DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { Q } from '@nozbe/watermelondb';
import { PublicAddressListDbModel } from '@database/models';
import { PublicAddressDB } from './public-address';

const publichAddressListDb = DatabaseTable.PublicAddressLists;

export class PublicAddressListDB {
  static async getList(id: string): Promise<PublicAddressListDbModel | null> {
    const lists = (await Database.query(
      publichAddressListDb,
      Q.where('id', Q.eq(id))
    )) as PublicAddressListDbModel[];
    if (lists.length > 0) return lists[0];
    return null;
  }

  static async getAll(): Promise<PublicAddressListDbModel[]> {
    const lists = (await Database.query(
      publichAddressListDb
    )) as PublicAddressListDbModel[];
    return lists;
  }

  static async addAccountsToList(
    accounts: CacheableAccount[],
    groupId: string
  ) {
    if (accounts.length == 0) return;
    await Promise.all(
      accounts.map((account) => PublicAddressDB.addToGroup(account, groupId))
    );
  }

  static async removeAddressesFromList(addresses: string[]) {
    if (addresses.length == 0) return;
    await Promise.all(
      addresses.map((address) => PublicAddressDB.removeFromGroup(address))
    );
  }

  static async createList(name: string, accounts?: CacheableAccount[]) {
    try {
      const newList = (await Database.createModel(publichAddressListDb, {
        name
      })) as PublicAddressListDbModel;
      if (accounts && accounts.length > 0) {
        this.addAccountsToList(accounts, newList.id);
      }
      return newList;
    } catch (error) {
      throw error;
    }
  }

  static async updateList(id: string, newName: string) {
    try {
      const listInDb = await this.getList(id);
      if (!listInDb) {
        throw Error('No such list found in db!');
      }
      if (!!newName && newName !== listInDb.name) {
        return await Database.updateModel(publichAddressListDb, id, {
          name: newName
        });
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteList(id: string) {
    const list = await this.getList(id);
    if (list) {
      const allAddresses = await list.fetchAddresses();
      for (const address of allAddresses) {
        await PublicAddressDB.removeFromGroup(address.address);
      }
      await Database.deleteModel(publichAddressListDb, list.id);
    }
  }
}
