import { appSchema } from '@nozbe/watermelondb';
import { WalletTable } from './wallet';

export const schema = appSchema({
  version: 1,
  tables: [WalletTable]
});
