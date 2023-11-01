import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import {
  TransactionsDBModel,
  WalletDBModel,
  AccountDBModel,
  WalletPubDBModel,
  TransactionRawDBModel,
  TransactionScannersTmpDBModel,
  AccountBalanceDBModel,
  CurrencyDBModel
} from './models';
import { schema } from './schemas';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'airdao_stage',
  jsi: Platform.OS === 'ios', // TODO (optional, but we should implement this method)
  onSetUpError: () => null
});

export const database = new Database({
  adapter,
  modelClasses: [
    AccountDBModel,
    AccountBalanceDBModel,
    CurrencyDBModel,
    TransactionsDBModel,
    TransactionRawDBModel,
    TransactionScannersTmpDBModel,
    WalletDBModel,
    WalletPubDBModel
  ]
});
