import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const CurrenciesTable = tableSchema({
  name: DatabaseTable.Currencies,
  columns: [
    {
      name: 'is_hidden',
      type: 'number'
    },
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'currency_rate_usd',
      type: 'number'
    },
    {
      name: 'currency_rate_json',
      type: 'string'
    },
    {
      name: 'currency_rate_scan_time',
      type: 'number'
    },
    {
      name: 'price_provider',
      type: 'string'
    },
    {
      name: 'price_change_percentage_24h',
      type: 'number'
    },

    {
      name: 'price_change_24h',
      type: 'number'
    },
    {
      name: 'price_high_24h',
      type: 'number'
    },
    {
      name: 'price_low_24h',
      type: 'number'
    },
    {
      name: 'price_last_updated',
      type: 'number'
    }
  ]
});
