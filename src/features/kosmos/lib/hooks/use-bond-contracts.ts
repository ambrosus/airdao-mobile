import { useEffect, useState } from 'react';
import { Contracts } from '@airdao/airdao-bond';
import { ethers } from 'ethers';
import { useBridgeContextData } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import Config from '@constants/config';

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
        const provider = new ethers.providers.JsonRpcProvider(
          Config.NETWORK_URL
        );

        const signer = new ethers.Wallet(privateKey, provider);
        const _contracts = new Contracts(signer, 16718);

        if (_contracts) setContracts(_contracts);
      } catch (error) {
        throw error;
      }
    })();
  }, [selectedAccount]);

  return { contracts };
}
