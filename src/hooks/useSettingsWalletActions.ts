import { CommonActions, useNavigation } from '@react-navigation/native';
import { API } from '@api/api';
import { DatabaseTable, SettingsTabNavigationProp } from '@appTypes';
import { Database, WalletDBModel } from '@database';
import { removePermissionByAddress } from '@features/browser/lib';
import { WalletUtils } from '@utils';

export function useSettingsWalletActions() {
  const navigation: SettingsTabNavigationProp = useNavigation();

  const deleteWallet = async (
    address: string | undefined,
    walletHash: string
  ) => {
    try {
      await WalletUtils.deleteWalletWithAccounts(walletHash);
      removePermissionByAddress(address || '');
      if (address) {
        await API.watcherService.removeWatcherForAddresses([address]);
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppInit' }]
        })
      );
    } catch (error) {
      throw error;
    } finally {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppInit' }]
        })
      );
    }
  };

  const saveChanges = async (wallet: WalletDBModel, walletName: string) => {
    await Database.updateModel(DatabaseTable.Wallets, wallet.id, {
      name: walletName
    });
    (wallet._raw as unknown as WalletDBModel).name = walletName;
    navigation.setParams({
      //@ts-ignore
      wallet
    });
  };

  return { deleteWallet, saveChanges };
}
