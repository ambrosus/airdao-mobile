import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { DatabaseTable } from '@appTypes';
import { Database, WalletDBModel } from '@database';
import { Cache, CacheKey } from '@utils/cache';

export const useSelectedWalletHash = (): string => {
  const [selectedWalletHash, setSelectedWalletHash] = useState('');

  const getSelectedWallet = async () => {
    const _selectedWalletHash = (await Cache.getItem(
      CacheKey.SelectedWallet
    )) as string;
    if (!_selectedWalletHash) {
      const allWallets = (await Database.query(
        DatabaseTable.Wallets
      )) as WalletDBModel[];
      const len = allWallets?.length || 0;
      if (allWallets && len > 0) {
        const hash = allWallets[len - 1].hash;
        setSelectedWalletHash(hash);
        Cache.setItem(CacheKey.SelectedWallet, hash);
      }
    }
    setSelectedWalletHash(_selectedWalletHash);
  };

  useFocusEffect(() => {
    getSelectedWallet();
  });

  return selectedWalletHash || '';
};
