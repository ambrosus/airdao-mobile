import { useMemo } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { CryptoCurrencyCode } from '@appTypes';
import { AMB_DECIMALS } from '@constants/variables';
import { useBalanceOfAddress } from '@hooks';
import { Token } from '@models';
import { TokenUtils } from '@utils';

export function useAMBEntity(senderAddress: string) {
  const { data: tokenBalance } = useBalanceOfAddress(senderAddress);

  const _AMBEntity: Token = useMemo(
    () =>
      new Token(
        {
          name: 'AirDAO',
          address: senderAddress || '',
          isNativeCoin: true,
          balance: {
            wei: tokenBalance.wei,
            ether: Number(tokenBalance.ether) || 0,
            formattedBalance: formatUnits(tokenBalance.wei, AMB_DECIMALS)
          },
          symbol: CryptoCurrencyCode.AMB,
          decimals: AMB_DECIMALS,
          tokenNameFromDatabase: 'AirDAO'
        },
        TokenUtils
      ),
    [senderAddress, tokenBalance.ether, tokenBalance.wei]
  );

  return _AMBEntity;
}
