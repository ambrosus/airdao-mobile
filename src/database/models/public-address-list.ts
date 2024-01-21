/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model, Q } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import { PublicAddressDbModel } from './public-address';

export class PublicAddressListDbModel extends Model {
  static table = DatabaseTable.PublicAddressLists;

  // define fields
  // @ts-ignore
  @text('name') name: string;

  async fetchAddresses(): Promise<PublicAddressDbModel[]> {
    return (await this.collections
      .get(DatabaseTable.PublicAddresses)
      .query(Q.where('group_id', this.id))
      .fetch()) as PublicAddressDbModel[];
  }
}
