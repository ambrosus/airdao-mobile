import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const TransactionsTable = tableSchema({
  name: DatabaseTable.Transactions,
  columns: [
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'hash',
      type: 'string'
    },
    {
      name: 'account_id',
      type: 'number'
    },
    {
      name: 'transaction_hash',
      type: 'string'
    },
    {
      name: 'transaction_hash_basic',
      type: 'string'
    },
    {
      name: 'block_hash',
      type: 'string'
    },
    {
      name: 'block_number',
      type: 'number'
    },
    {
      name: 'block_confirmations',
      type: 'number'
    },
    {
      name: 'transaction_status',
      type: 'string'
    },
    {
      name: 'transaction_direction',
      type: 'string'
    },
    {
      name: 'transaction_of_airdao_wallet',
      type: 'number'
    },
    {
      name: 'address_to',
      type: 'string'
    },
    {
      name: 'address_to_basic',
      type: 'string'
    },
    {
      name: 'address_from',
      type: 'string'
    },
    {
      name: 'address_from_basic',
      type: 'string'
    },
    {
      name: 'address_amount',
      type: 'number'
    },
    {
      name: 'transaction_fee',
      type: 'number'
    },
    {
      name: 'transaction_fee_currency_code',
      type: 'string'
    },
    {
      name: 'transaction_filter_type',
      type: 'string'
    },
    {
      name: 'vout',
      type: 'string'
    },
    {
      name: 'vin',
      type: 'string'
    },
    {
      name: 'contract_address',
      type: 'string'
    },
    {
      name: 'input_value',
      type: 'number'
    },
    {
      name: 'transaction_json',
      type: 'string'
    },
    {
      name: 'transactions_scan_time',
      type: 'number'
    },
    {
      name: 'transactions_scan_log',
      type: 'string'
    },
    {
      name: 'transactions_other_hashes',
      type: 'string'
    },
    {
      name: 'bse_order_id',
      type: 'string'
    },
    {
      name: 'bse_order_id_in',
      type: 'string'
    },
    {
      name: 'bse_order_id_out',
      type: 'string'
    },
    {
      name: 'bse_order_data',
      type: 'string'
    },
    {
      name: 'lock_time',
      type: 'number'
    },
    {
      name: 'block_time',
      type: 'number'
    },
    {
      name: 'created_at',
      type: 'number'
    },
    {
      name: 'mined_at',
      type: 'number'
    },
    {
      name: 'updated_at',
      type: 'number'
    },
    {
      name: 'hidden_at',
      type: 'number'
    },
    {
      name: 'special_action_needed',
      type: 'string'
    }
  ]
});
