import { API } from '@api/api';
import { Permission } from '@appTypes';
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

export const AddressUtils = { watchChangesOfAddress, addressToToken };
