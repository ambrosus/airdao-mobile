import { useMemo } from 'react';
import { ethers } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { DatabaseTokenModel } from '@constants/allToken';
import Config from '@constants/config';
import { useERC20Balance } from '@hooks';
import { Token } from '@models';
import { TokenUtils } from '@utils';

const address = Config.ALL_TOKENS.find(
  (token: DatabaseTokenModel) => token.symbol === 'HBR'
).address;

export function useHBRInstance() {
  const { balance: bnBalance } = useERC20Balance(address);

  const balance = useMemo(() => {
    if (!bnBalance) {
      return {
        wei: '0',
        ether: 0,
        formattedBalance: '0'
      };
    }

    return {
      wei: bnBalance.toString(),
      ether: bnBalance,
      formattedBalance: ethers.utils.formatEther(bnBalance as ethers.BigNumber)
    };
  }, [bnBalance]);

  return useMemo(() => {
    return new Token(
      {
        name: 'Harbor',
        address,
        isNativeCoin: true,
        balance: {
          wei: balance?.wei || '0',
          ether: +balance?.ether || 0,
          formattedBalance: balance.formattedBalance || '0'
        },
        symbol: CryptoCurrencyCode.HBR,
        decimals: 18,
        tokenNameFromDatabase: 'Harbor'
      },
      TokenUtils
    );
  }, [balance?.ether, balance.formattedBalance, balance?.wei]);
}
