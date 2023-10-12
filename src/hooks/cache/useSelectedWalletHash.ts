import { useEffect, useState } from 'react';
import { DatabaseTable, QueryResponse } from '@appTypes';
import { Database, WalletDBModel } from '@database';
import { Cache, CacheKey } from '@lib/cache';

export const useSelectedWalletHash = (): QueryResponse<string> => {
  const [loading, setLoading] = useState(true);
  const [selectedWalletHash, setSelectedWalletHash] = useState('');

  const getSelectedWallet = async () => {
    try {
      setLoading(true);
      const _selectedWalletHash = (await Cache.getItem(
        CacheKey.SelectedWallet
      )) as string;
      if (!_selectedWalletHash) {
        const allWallets = (await Database.query(
          DatabaseTable.Wallets
        )) as WalletDBModel[];
        const len = allWallets?.length || 0;
        if (len > 0) {
          const hash = allWallets[len - 1].hash;
          setSelectedWalletHash(hash);
          await Cache.setItem(CacheKey.SelectedWallet, hash);
        }
      }
      setSelectedWalletHash(_selectedWalletHash);
    } catch (error) {
      // TODO
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSelectedWallet();
  }, []);

  return {
    data: selectedWalletHash,
    loading,
    error: null
  };
};
