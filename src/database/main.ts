import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { WalletDBModel } from './models';
import { schema } from './schemas';
import { Platform } from 'react-native';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'airado',
  jsi: Platform.OS === 'ios',
  // TODO (optional, but we should implement this method)
  onSetUpError: () => null
});

export const database = new Database({
  adapter,
  modelClasses: [WalletDBModel]
});
