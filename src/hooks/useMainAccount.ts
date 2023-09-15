import { ExplorerAccount } from '@models';
import { useSelectedWalletHash } from './cache';
import { useAccountByWalletHash } from './database';
import { useBalanceOfAddress } from './query';

export const useMainAccount = () => {
  const { data: hash } = useSelectedWalletHash();
  const { data: mainAccount, loading } = useAccountByWalletHash(hash);

  const { data: mainAccountBalance } = useBalanceOfAddress(
    mainAccount?.address || ''
  );

  const account = mainAccount ? ExplorerAccount.fromDBModel(mainAccount) : null;

  if (account) {
    account.ambBalance = Number(mainAccountBalance.ether);
  }
  return { account, accountLoading: loading };
};
