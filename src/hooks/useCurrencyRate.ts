import { useEffect, useState } from 'react';
import { useAMBPrice, useAmbrosusStakingPools } from './query';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { TOKEN_ADDRESSES } from '@constants/variables';

export const useCurrencyRate = (
  symbol: AirDAODictTypes.Code = AirDAODictTypes.Code.AMB
): number => {
  const { data: stakingPools } = useAmbrosusStakingPools();
  const { data: ambPrice } = useAMBPrice();
  const [currencyRate, setCurrencyRate] = useState(0);
  useEffect(() => {
    let _currencyRate = 1; // AMB/USD
    switch (symbol) {
      case AirDAODictTypes.Code.USDC:
      case AirDAODictTypes.Code.Tether:
      case AirDAODictTypes.Code.BUSD: {
        _currencyRate = 1 / (ambPrice?.priceUSD || 1);
        break;
      }
      case AirDAODictTypes.Code.HeraPoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Hera
          )?.tokenPrice || 1;
        break;
      }
      case AirDAODictTypes.Code.GanymedePoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Ganymade
          )?.tokenPrice || 1;
        break;
      }
      case AirDAODictTypes.Code.PlutusPoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Plutus
          )?.tokenPrice || 1;
        break;
      }
      default:
        _currencyRate = ambPrice?.priceUSD || 0;
        break;
    }
    setCurrencyRate(_currencyRate * (ambPrice?.priceUSD || 1));
  }, [ambPrice, stakingPools, symbol]);

  return currencyRate;
};
