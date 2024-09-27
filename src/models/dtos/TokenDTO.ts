import { CryptoCurrencyCode } from '@appTypes';

export interface TokenDTO {
  address: string;
  name: string;
  isNativeCoin: boolean;
  balance: {
    formattedBalance: string;
    wei: string;
    ether: number;
  };
  tokenNameFromDatabase: string;
  decimals: number;
  symbol: CryptoCurrencyCode | '';
}
