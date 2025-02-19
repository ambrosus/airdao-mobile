import { useBrowserStore } from '@entities/browser/model';
import { rpcMethods } from '../rpc-methods';

export const ethAccounts = async ({ privateKey }: { privateKey: string }) => {
  const { connectedAddress } = useBrowserStore.getState();
  const { getCurrentAddress } = rpcMethods;

  if (!connectedAddress) return [];

  const address = await getCurrentAddress(privateKey);
  return address ? [address] : [];
};
