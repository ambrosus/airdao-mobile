import { API } from '@api/api';
import { Permission } from '@appTypes';
import { PermissionService } from '@lib';
import { ExplorerAccount } from '@models';

const watchChangesOfWallet = async (wallet: ExplorerAccount) => {
  const notificationPermissionGranted = await PermissionService.getPermission(
    Permission.Notifications
  );
  if (notificationPermissionGranted) {
    API.watchAddress(wallet.address);
  }
};

export const WALLET_UTILS = { watchChangesOfWallet };
