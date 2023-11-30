import { POOL_ADDRESSES } from '@constants/variables';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

const getTokenDetails = (
  address: string
): { name: string; symbol: AirDAODictTypes.Code } => {
  let name = '';
  let symbol = AirDAODictTypes.Code.AMB;
  switch (address) {
    case POOL_ADDRESSES.BUSD: {
      // hera
      name = 'BUSD';
      symbol = AirDAODictTypes.Code.BUSD;
      break;
    }
    case POOL_ADDRESSES.Hera: {
      // hera
      name = 'Hera Pool Token';
      symbol = AirDAODictTypes.Code.HeraPoolToken;
      break;
    }
    case POOL_ADDRESSES.Ganymade: {
      // ganymede
      name = 'Ganymede Pool Token';
      symbol = AirDAODictTypes.Code.GanymedePoolToken;
      break;
    }
    case POOL_ADDRESSES.Plutus: {
      // hera
      name = 'Plutus Pool Token';
      symbol = AirDAODictTypes.Code.PlutusPoolToken;
      break;
    }
    default:
      break;
  }
  return { name, symbol };
};

export const TokenUtils = { getTokenDetails };
