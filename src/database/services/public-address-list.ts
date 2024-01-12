import { DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { Q } from '@nozbe/watermelondb';
import { PublicAddressListDbModel } from '@database/models';

const publichAddressListDb = DatabaseTable.PublicAddressLists;

interface PublicAddressList {
  id: string;
  name: string;
  addresses: string[];
}

export class PublicAddressListDB {
  static async getList(id: string): Promise<PublicAddressListDbModel | null> {
    const lists = (await Database.query(
      publichAddressListDb,
      Q.where('id', Q.eq(id))
    )) as PublicAddressListDbModel[];
    if (lists.length > 0) return lists[0];
    return null;
  }

  static async createOrUpdateList(
    list: PublicAddressList
  ): Promise<PublicAddressListDbModel> {
    try {
      const listInDb = await this.getList(list.id);
      let finalList: PublicAddressListDbModel;
      if (listInDb) {
        finalList = (await this.updateList(
          listInDb.id,
          list
        )) as PublicAddressListDbModel;
      } else {
        finalList = (await Database.createModel(
          publichAddressListDb,
          list
        )) as PublicAddressListDbModel;
      }
      return finalList;
    } catch (error) {
      throw error;
    }
  }

  static async updateList(id: string, updateObj: Partial<PublicAddressList>) {
    const list = await this.getList(id);
    if (!list) {
      console.error(
        'PublicAddressListDB --> could not find any saved list by id --> ',
        {
          id
        }
      );
      throw Error('Could not find account by id');
    }
    return await Database.updateModel(publichAddressListDb, list.id, updateObj);
  }

  static async deleteList(id: string) {
    const list = await this.getList(id);
    if (list) return await Database.deleteModel(publichAddressListDb, list.id);
  }
}
