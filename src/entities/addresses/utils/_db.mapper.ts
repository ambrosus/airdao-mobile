import { ExplorerAccount } from '@models';
import { PublicAddressDB } from '@database';

export async function _dbAddressesMapper(payload: ExplorerAccount[]) {
  return payload.reduce<Promise<ExplorerAccount[]>>(
    async (accPromise, account) => {
      await PublicAddressDB.createOrUpdateAddress(account);
      return [...(await accPromise), account];
    },
    Promise.resolve([])
  );
}
