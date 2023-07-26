import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { WalletDBModel } from './models';
import { schema } from './schemas';
import { TransactionScannersTmpDBModel } from './models/transaction-scanners-tmp';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'airdao_dev',
  jsi: Platform.OS === 'ios',
  // TODO (optional, but we should implement this method)
  onSetUpError: () => null
});

export const database = new Database({
  adapter,
  modelClasses: [WalletDBModel, TransactionScannersTmpDBModel]
});
