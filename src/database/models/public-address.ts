/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';

export class PublicAddressDbModel extends Model {
  static table = DatabaseTable.PublicAddresses;
  // define fields

  // @ts-ignore
  @text('address') address: string;
  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @field('is_watchlisted') isOnWatchlist: boolean;
  // @ts-ignore
  @text('group_id') groupId: string;
}
