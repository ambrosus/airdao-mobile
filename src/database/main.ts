import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { WalletDBModel } from './models';
import { schema } from './schemas';
import { TransactionScannersTmpDBModel } from './models/transaction-scanners-tmp';
import { WalletPubDBModel } from './models/wallet-pub';
import { AccountDBModel } from './models/account';
import { TransactionRawDBModel } from './models/transactions-raw';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'airdao_dev',
  jsi: Platform.OS === 'ios',
  // TODO (optional, but we should implement this method)
  onSetUpError: () => null
});

export const database = new Database({
  adapter,
  modelClasses: [
    AccountDBModel,
    TransactionRawDBModel,
    TransactionScannersTmpDBModel,
    WalletDBModel,
    WalletPubDBModel
  ]
});
