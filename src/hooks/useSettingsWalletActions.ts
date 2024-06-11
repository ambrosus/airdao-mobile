import { CommonActions, useNavigation } from '@react-navigation/native';
import { DatabaseTable, SettingsTabNavigationProp } from '@appTypes';
import { WalletUtils } from '@utils/wallet';
import { API } from '@api/api';
import { Database, WalletDBModel } from '@database';

export function useSettingsWalletActions() {
  const navigation: SettingsTabNavigationProp = useNavigation();

  const deleteWallet = async (
    address: string | undefined,
    walletHash: string
  ) => {
    try {
      await WalletUtils.deleteWalletWithAccounts(walletHash);
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
    //@ts-ignore
    navigation.setParams({
      wallet: wallet
    });
  };

  return { deleteWallet, saveChanges };
}
