import { API } from '@api/api';
import { Permission } from '@appTypes';
import { PermissionService } from '@lib';
import { ExplorerAccount } from '@models';

const watchChangesOfWallet = async (wallet: ExplorerAccount) => {
  await PermissionService.getPermission(Permission.Notifications, {
    requestAgain: true
  });
  API.watcherService.watchAddresses([wallet.address]);
};

export const WALLET_UTILS = { watchChangesOfWallet };
