import { TOKEN_ADDRESSES } from '@constants/variables';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

const getTokenDetails = (
  address: string
): { name: string; symbol: AirDAODictTypes.Code } => {
  let name = '';
  let symbol = AirDAODictTypes.Code.AMB;
  switch (address) {
    case TOKEN_ADDRESSES.AirBond: {
      // AirBond
      name = 'AirBond';
      symbol = AirDAODictTypes.Code.Bond;
      break;
    }
    case TOKEN_ADDRESSES.BUSD: {
      // BUSD
      name = 'BUSD';
      symbol = AirDAODictTypes.Code.BUSD;
      break;
    }
    case TOKEN_ADDRESSES.FLP: {
      // FLP
      name = 'Firepot-LP-Token';
      symbol = AirDAODictTypes.Code.FirepotLp;
      break;
    }
    case TOKEN_ADDRESSES.Hera: {
      // hera
      name = 'Hera Pool Token';
      symbol = AirDAODictTypes.Code.HeraPoolToken;
      break;
    }
    case TOKEN_ADDRESSES.Ganymade: {
      // ganymede
      name = 'Ganymede Pool Token';
      symbol = AirDAODictTypes.Code.GanymedePoolToken;
      break;
    }
    case TOKEN_ADDRESSES.LangOperation: {
      // Operation Funds Lang Inu
      name = 'Operation Funds Lang Inu';
      symbol = AirDAODictTypes.Code.LangOperation;
      break;
    }
    case TOKEN_ADDRESSES.Plutus: {
      // plutus
      name = 'Plutus Pool Token';
      symbol = AirDAODictTypes.Code.PlutusPoolToken;
      break;
    }
    case TOKEN_ADDRESSES.USDC: {
      // USDC
      name = 'USD Coin';
      symbol = AirDAODictTypes.Code.USDC;
      break;
    }
    case TOKEN_ADDRESSES.USDT: {
      // USDT
      name = 'Tether USD';
      symbol = AirDAODictTypes.Code.Tether;
      break;
    }
    default:
      break;
  }
  return { name, symbol };
};

export const TokenUtils = { getTokenDetails };
