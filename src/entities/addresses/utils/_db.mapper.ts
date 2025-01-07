import { PublicAddressDB } from '@database';
import { ExplorerAccount } from '@models';

export async function _dbAddressesMapper(payload: ExplorerAccount[]) {
  return payload.reduce<Promise<ExplorerAccount[]>>(
    async (accPromise, account) => {
      await PublicAddressDB.createOrUpdateAddress(account);
      return [...(await accPromise), account];
    },
    Promise.resolve([])
  );
}
