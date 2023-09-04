import { useSelectedWalletHash } from './cache';
import { useCryptoAccountFromHash } from './query';

export const useMainAccount = () => {
  const { data: hash } = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(hash);
  return { account, accountLoading };
};
