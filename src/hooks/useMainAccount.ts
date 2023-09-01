import { useSelectedWalletHash } from './cache';
import { useCryptoAccountFromHash } from './query';

export const useMainAccount = () => {
  const hash = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(hash);
  return { account, accountLoading };
};
