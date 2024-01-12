import { DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { Q } from '@nozbe/watermelondb';
import { PublicAddressDbModel } from '@database/models/public-address';

const publichAddressesDb = DatabaseTable.PublicAddresses;

interface PublicAddress {
  name: string;
  address: string;
  isOnWatchlist: boolean;
}

export class PublicAddressDB {
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
    publicAddress: PublicAddress
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

  static async updateAddress(
    address: string,
    updateObj: Partial<PublicAddress>
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
    if (publicAddress)
      return await Database.deleteModel(publichAddressesDb, publicAddress.id);
  }
}
