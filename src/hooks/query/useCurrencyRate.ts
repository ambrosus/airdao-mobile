import { useEffect, useState } from 'react';
import { useAMBPrice } from './useAMBPrice';
import { useAmbrosusStakingPools } from './useAmbrosusStakingPools';
import { CryptoCurrencyCode } from '@appTypes';
import { TOKEN_ADDRESSES } from '@constants/variables';
import { useAirbondPrice } from './useAirbondPrice';

export const useCurrencyRate = (
  symbol: CryptoCurrencyCode = CryptoCurrencyCode.AMB
): number => {
  const { data: stakingPools } = useAmbrosusStakingPools();
  const { data: ambPrice } = useAMBPrice();
  const [currencyRate, setCurrencyRate] = useState(0);
  const { data: airbondPrice } = useAirbondPrice();
  useEffect(() => {
    let _currencyRate = 1; // token/AMB
    switch (symbol) {
      case CryptoCurrencyCode.Bond:
      case CryptoCurrencyCode.SAMB:
      case CryptoCurrencyCode.AMB: {
        _currencyRate = 1;
        break;
      }
      case CryptoCurrencyCode.USDC:
      case CryptoCurrencyCode.Tether:
      case CryptoCurrencyCode.BUSD: {
        _currencyRate = 1;
        setCurrencyRate(1);
        return;
      }
      case CryptoCurrencyCode.HeraPoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Hera
          )?.tokenPrice || 1;
        break;
      }
      case CryptoCurrencyCode.GanymedePoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Ganymade
          )?.tokenPrice || 1;
        break;
      }
      case CryptoCurrencyCode.PlutusPoolToken: {
        _currencyRate =
          stakingPools.find(
            (pool) => pool.token.address === TOKEN_ADDRESSES.Plutus
          )?.tokenPrice || 1;
        break;
      }
      default:
        _currencyRate = -1;
        setCurrencyRate(-1);
        return;
    }
    setCurrencyRate(_currencyRate * (ambPrice?.priceUSD || 1));
  }, [airbondPrice, ambPrice, stakingPools, symbol]);

  return currencyRate;
};
