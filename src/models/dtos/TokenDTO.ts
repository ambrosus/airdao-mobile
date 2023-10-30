import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export interface TokenDTO {
  address: string;
  name: string;
  balance: {
    wei: string;
    ether: number;
  };
  symbol: AirDAODictTypes.Code | '';
}
