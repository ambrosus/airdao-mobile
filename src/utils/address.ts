import { API } from '@api/api';
import { CacheableAccount, Permission } from '@appTypes';
import { PermissionService } from '@lib';
import { ExplorerAccount } from '@models';

const watchChangesOfAddress = async (address: ExplorerAccount) => {
  await PermissionService.getPermission(Permission.Notifications, {
    requestAgain: true
  });
  API.watcherService.watchAddresses([address.address]);
};

const addressToToken = (address: string) => {
  // any algo could be used to "hide" actual address
  return Buffer.from(address).toString('base64').slice(3, 11);
};

const populateAddresses = async (
  addresses: CacheableAccount[]
): Promise<ExplorerAccount[]> => {
  try {
    return await Promise.all(
      addresses.map(async (address) => {
        try {
          const account = new ExplorerAccount(
            await API.explorerService.searchAddress(address.address)
          );
          const newAccount = Object.assign({}, account);
          newAccount.name = address.name;
          newAccount.isOnWatchlist = Boolean(address.isOnWatchlist);
          return newAccount;
        } catch (error) {
          throw error;
        }
      })
    );
  } catch (error) {
    throw error;
  }
};

export const AddressUtils = {
  watchChangesOfAddress,
  addressToToken,
  populateAddresses
};
