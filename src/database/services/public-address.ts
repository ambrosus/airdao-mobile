import Database from '@database/Database';
import { Q } from '@nozbe/watermelondb';
import { PublicAddressDbModel } from '@database/models';
import { CacheableAccount, DatabaseTable } from '@appTypes';

const publichAddressesDb = DatabaseTable.PublicAddresses;

export class PublicAddressDB {
  static async getAll(): Promise<PublicAddressDbModel[]> {
    const allAddresses = (await Database.query(
      publichAddressesDb
    )) as PublicAddressDbModel[];
    return allAddresses;
  }

  static async getPublicAddress(
    address: string
  ): Promise<PublicAddressDbModel | null> {
    const publicAddresses = (await Database.query(
      publichAddressesDb,
      Q.where('address', Q.eq(address))
    )) as PublicAddressDbModel[];
    if (publicAddresses.length > 0) return publicAddresses[0];
    return null;
  }

  static async createOrUpdateAddress(
    publicAddress: CacheableAccount
  ): Promise<PublicAddressDbModel> {
    try {
      const publicAddressInDb = await this.getPublicAddress(
        publicAddress.address
      );
      let finalPublicAddress: PublicAddressDbModel;
      if (publicAddressInDb) {
        finalPublicAddress = (await this.updateAddress(
          publicAddressInDb.address,
          publicAddress
        )) as PublicAddressDbModel;
      } else {
        finalPublicAddress = (await Database.createModel(
          publichAddressesDb,
          publicAddress
        )) as PublicAddressDbModel;
      }
      return finalPublicAddress;
    } catch (error) {
      throw error;
    }
  }

  private static async updateAddress(
    address: string,
    updateObj: Partial<CacheableAccount>
  ) {
    const publicAddress = await this.getPublicAddress(address);
    if (!publicAddress) {
      console.error(
        'PublicAddressDB --> could not find any saved public wallet by address --> ',
        {
          address
        }
      );
      throw Error('Could not find account by address');
    }
    return await Database.updateModel(
      publichAddressesDb,
      publicAddress.id,
      updateObj
    );
  }

  static async deleteAddress(address: string) {
    const publicAddress = await this.getPublicAddress(address);
    if (publicAddress) {
      return await Database.deleteModel(publichAddressesDb, publicAddress.id);
    }
  }

  static async addToGroup(address: CacheableAccount, groupId: string) {
    return await this.createOrUpdateAddress({ ...address, groupId });
  }

  static async removeFromGroup(address: string) {
    const addressInDb = await this.getPublicAddress(address);
    if (addressInDb) {
      if (!addressInDb.isOnWatchlist) {
        // delete address if it is not watchlisted
        await this.deleteAddress(address);
      } else {
        // remove from group otherwise
        await this.updateAddress(address, { groupId: '' });
      }
    }
  }
}
