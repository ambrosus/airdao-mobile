import { appSchema } from '@nozbe/watermelondb';
import { WalletTable } from './wallet';
import { TransactionScannersTmpTable } from './transaction-scanners-tmp';
import { WalletPubTable } from './wallet-pub';
import { AccountsTable } from './account';
import { TransactionRawTable } from './transaction-raw';

export const schema = appSchema({
  version: 1,
  tables: [
    AccountsTable,
    TransactionRawTable,
    TransactionScannersTmpTable,
    WalletTable,
    WalletPubTable
  ]
});
