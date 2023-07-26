import { appSchema } from '@nozbe/watermelondb';
import { WalletTable } from './wallet';
import { TransactionScannersTmpTable } from './transaction-scanners-tmp';

export const schema = appSchema({
  version: 1,
  tables: [WalletTable, TransactionScannersTmpTable]
});
