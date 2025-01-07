import { useWalletConnectContext } from '@features/wallet-connect/context';

export const useWalletConnectContextSelector = () =>
  useWalletConnectContext((ctx) => ctx);
