/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, children } from '@nozbe/watermelondb/decorators';
import { PublicAddressDbModel } from './public-address';

export class PublicAddressListDbModel extends Model {
  static table = DatabaseTable.PublicAddressLists;

  // define fields

  // @ts-ignore
  @text('name') name: string;
  // define relations
  // @ts-ignore
  @children('addresses') addresses: PublicAddressDbModel[];
}
