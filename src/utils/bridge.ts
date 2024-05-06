import { StringUtils } from '@utils/string';
import moment from 'moment/moment';

export enum NETWORK {
  eth = 'Ethereum',
  bsc = 'Binance Smart Chain',
  amb = 'AirDAO'
}

export const tokenThumb = (transaction: string) => {
  return transaction.includes('SAMB') ? 'AMB' : transaction;
};

export const transactionFrom = (transaction: string) => {
  return transaction.includes('x')
    ? StringUtils.formatAddress(transaction, 5, 6)
    : transaction;
};

export const timestamp = (_timestamp: number) => {
  return moment(_timestamp * 1000).format('MMM DD, YYYY HH:mm');
};
