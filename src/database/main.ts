import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import {
  TransactionsDBModel,
  WalletDBModel,
  AccountDBModel,
  WalletPubDBModel,
  TransactionRawDBModel,
  TransactionScannersTmpDBModel
} from './models';
import { schema } from './schemas';
import { PublicAddressDbModel } from './models/public-address';
import { PublicAddressListDbModel } from './models/public-address-list';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'airdao',
  jsi: Platform.OS === 'ios', // TODO (optional, but we should implement this method)
  onSetUpError: () => null
});

export const database = new Database({
  adapter,
  modelClasses: [
    AccountDBModel,
    PublicAddressDbModel,
    PublicAddressListDbModel,
    TransactionsDBModel,
    TransactionRawDBModel,
    TransactionScannersTmpDBModel,
    WalletDBModel,
    WalletPubDBModel
  ]
});
