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

export const AddressUtils = { watchChangesOfAddress };
