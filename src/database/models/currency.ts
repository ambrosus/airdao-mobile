/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';

export class CurrencyDBModel extends Model {
  static table = DatabaseTable.Currencies;

  // @ts-ignore
  @field('is_hidden') isHidden: number;
  // @ts-ignore
  @text('currency_code') currencyCode: string;
  // @ts-ignore
  @field('currency_rate_usd') currencyRateUSD: number;
  // @ts-ignore
  @text('currency_rate_json') currencyRateJSON: string;
  // @ts-ignore
  @field('currency_rate_scan_time') currencyRateScanTime: number;
  // @ts-ignore
  @text('price_provider') priceProvider: string;
  // @ts-ignore
  @field('price_change_24h') priceChange24H: number;
  // @ts-ignore
  @field('price_high_24h') priceHigh24H: number;
  // @ts-ignore
  @field('price_low_24h') priceLow24H: number;
  // @ts-ignore
  @field('price_last_updated') priceLastUpdated: number;
}
