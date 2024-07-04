import { useEffect, useState } from 'react';
import { Contracts } from '@airdao/airdao-bond';
import { ethers } from 'ethers';
import { useBridgeContextData } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';

export function useBondContracts() {
  const { selectedAccount } = useBridgeContextData();
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const privateKey = (await Cache.getItem(
          // @ts-ignore
          `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
        )) as string;

        const signer = new ethers.Wallet(privateKey);
        const _contracts = new Contracts(signer, 16718);

        if (_contracts) setContracts(_contracts);
      } catch (error) {
        throw error;
      }
    })();
  }, [selectedAccount]);

  return { contracts };
}
