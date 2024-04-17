import { CryptoCurrencyCode } from '@appTypes';
import { TOKEN_ADDRESSES } from '@constants/variables';

const getTokenDetails = (
  address: string
): { name: string; symbol: CryptoCurrencyCode } => {
  let name = '';
  let symbol = CryptoCurrencyCode.AMB;
  switch (address) {
    case TOKEN_ADDRESSES.AirBond: {
      // AirBond
      name = 'AirBond';
      symbol = CryptoCurrencyCode.Bond;
      break;
    }
    case TOKEN_ADDRESSES.BUSD: {
      // BUSD
      name = 'BUSD';
      symbol = CryptoCurrencyCode.BUSD;
      break;
    }
    case TOKEN_ADDRESSES['“Test1“']: {
      // BUSD
      name = 'Test1';
      symbol = CryptoCurrencyCode.AMB;
      break;
    }
    case TOKEN_ADDRESSES['“Test2“']: {
      // BUSD
      name = 'Test2';
      symbol = CryptoCurrencyCode.AMB;
      break;
    }
    case TOKEN_ADDRESSES.FLP_OLD: {
      // FLP_OLD
      name = 'Firepot-LP-Token';
      symbol = CryptoCurrencyCode.FirepotLp;
      break;
    }
    case TOKEN_ADDRESSES.FLP: {
      // FLP
      name = 'Firepot-LP-Token';
      symbol = CryptoCurrencyCode.FirepotLp;
      break;
    }
    case TOKEN_ADDRESSES.Hera: {
      // hera
      name = 'Hera Pool Token';
      symbol = CryptoCurrencyCode.HeraPoolToken;
      break;
    }
    case TOKEN_ADDRESSES.Ganymade: {
      // ganymede
      name = 'Ganymede Pool Token';
      symbol = CryptoCurrencyCode.GanymedePoolToken;
      break;
    }
    case TOKEN_ADDRESSES.LangOperation: {
      // Operation Funds Lang Inu
      name = 'Operation Funds Lang Inu';
      symbol = CryptoCurrencyCode.LangOperation;
      break;
    }
    case TOKEN_ADDRESSES.Plutus: {
      // plutus
      name = 'Plutus Pool Token';
      symbol = CryptoCurrencyCode.PlutusPoolToken;
      break;
    }
    case TOKEN_ADDRESSES.USDC: {
      // USDC
      name = 'USD Coin';
      symbol = CryptoCurrencyCode.USDC;
      break;
    }
    case TOKEN_ADDRESSES.USDC_OLD: {
      // USDC_OLD
      name = 'USD Coin';
      symbol = CryptoCurrencyCode.USDC;
      break;
    }
    case TOKEN_ADDRESSES.USDT: {
      // USDT
      name = 'Tether USD';
      symbol = CryptoCurrencyCode.Tether;
      break;
    }
    default:
      break;
  }
  return { name, symbol };
};

export const TokenUtils = { getTokenDetails };
