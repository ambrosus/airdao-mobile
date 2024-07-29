import { useCallback } from 'react';
import { useWalletContextSelector } from '@contexts';
import {
  IsNullableAccount,
  WalletReducerKeys
} from '@contexts/Wallet/wallet.types';
import { Cache, CacheKey } from '@lib/cache';
import { AccountDBModel } from '@database';

interface ReturnedHookValues {
  wallet: IsNullableAccount;
  onChangeSelectedWallet: (acount: AccountDBModel) => void;
  onExtractPrivateKey: () => Promise<string>;
}

/**
 * Hook to manage wallet state and actions.
 *
 * @returns {ReturnedHookValues} - An object containing the wallet state, a function to change the selected wallet, and a function to extract the private key.
 * @returns {IsNullableAccount} wallet - The current wallet state.
 * @returns {(account: IsNullableAccount) => void} onChangeSelectedWallet - Function to change the selected wallet.
 * @returns {() => Promise<string>} onExtractPrivateKey - Function to extract the private key.
 */
export function useWallet(): ReturnedHookValues {
  const { wallet, dispatchWallet } = useWalletContextSelector();

  /**
   * Function to change the selected wallet.
   *
   * @param {IsNullableAccount} account - The new wallet account.
   */
  const onChangeSelectedWallet = useCallback(
    (account: IsNullableAccount) => {
      dispatchWallet({
        type: WalletReducerKeys.SET_ACCOUNT,
        payload: account
      });
    },
    [dispatchWallet]
  );

  /**
   * Function to extract the private key from cache.
   *
   * @returns {Promise<string>} - A promise that resolves to the private key.
   */
  const onExtractPrivateKey = useCallback(async () => {
    return (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
    )) as string;
  }, []);

  return { wallet, onChangeSelectedWallet, onExtractPrivateKey };
}