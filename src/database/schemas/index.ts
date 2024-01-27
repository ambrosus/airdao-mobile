import { appSchema } from '@nozbe/watermelondb';
import { WalletTable } from './wallet';
import { TransactionScannersTmpTable } from './transaction-scanners-tmp';
import { WalletPubTable } from './wallet-pub';
import { AccountsTable } from './account';
import { TransactionRawTable } from './transaction-raw';
import { TransactionsTable } from './transactions';
import { PublicAddressesTable } from './public-address';
import { PublicAddressListsTable } from './public-address-list';

export const schema = appSchema({
  version: 1,
  tables: [
    AccountsTable,
    PublicAddressesTable,
    PublicAddressListsTable,
    TransactionsTable,
    TransactionRawTable,
    TransactionScannersTmpTable,
    WalletTable,
    WalletPubTable
  ]
});
