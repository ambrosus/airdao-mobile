import { appSchema } from '@nozbe/watermelondb';
import { AccountsTable } from './account';
import { PublicAddressesTable } from './public-address';
import { PublicAddressListsTable } from './public-address-list';
import { TransactionRawTable } from './transaction-raw';
import { TransactionScannersTmpTable } from './transaction-scanners-tmp';
import { TransactionsTable } from './transactions';
import { WalletTable } from './wallet';
import { WalletPubTable } from './wallet-pub';

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
