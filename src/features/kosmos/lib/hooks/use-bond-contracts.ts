import { useEffect, useState } from 'react';
import { Contracts } from '@airdao/airdao-bond';
import { ethers } from 'ethers';
import { useWalletPrivateKey } from '@entities/wallet';
import Config from '@constants/config';

export function useBondContracts() {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const privateKey = await _extractPrivateKey();
        const provider = new ethers.providers.JsonRpcProvider(
          Config.NETWORK_URL
        );

        const signer = new ethers.Wallet(privateKey, provider);
        const _contracts = new Contracts(signer, Config.CHAIN_ID);

        if (_contracts) setContracts(_contracts);
      } catch (error) {
        throw error;
      }
    })();
  }, [_extractPrivateKey]);

  return { contracts };
}
