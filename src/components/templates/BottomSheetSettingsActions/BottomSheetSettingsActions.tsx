import React, { ForwardedRef, forwardRef } from 'react';
import { Alert, View } from 'react-native';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { TrashIcon } from '@components/svg/icons';
import {
  CommonActions,
  NavigationProp,
  useNavigation
} from '@react-navigation/native';
import { SettingsTabParamsList } from '@appTypes';
import { useTranslation } from 'react-i18next';
import { WalletDBModel } from '@database';
import { WalletUtils } from '@utils/wallet';
import { API } from '@api/api';
import { ExplorerAccount } from '@models';
import { useForwardedRef } from '@hooks';

interface BottomSheetSettingsActionsProps {
  wallet: WalletDBModel;
  account: ExplorerAccount | null;
}

export const BottomSheetSettingsActions = forwardRef<
  BottomSheetRef,
  BottomSheetSettingsActionsProps
>(({ wallet, account }, ref) => {
  const { t } = useTranslation();
  const navigation: NavigationProp<SettingsTabParamsList> = useNavigation();
  const bottomSheetRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const deleteWallet = async () => {
    await WalletUtils.deleteWalletWithAccounts(wallet.hash);
    if (account?.address) {
      API.watcherService.removeWatcherForAddresses([account.address]);
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppInit' }]
      })
    );
  };

  const dismissBottomSheetView = () => bottomSheetRef.current?.dismiss();

  const onViewRecoveryPress = async (): Promise<void> => {
    dismissBottomSheetView();

    const onPasscodeApprove = () => {
      navigation.navigate('RecoveryPhrase', { walletHash: wallet.hash });
    };

    setTimeout(() => {
      navigation.navigate('Passcode', {
        onPasscodeApprove,
        title: 'View Recovery Phrase'
      });
    }, 500);
  };

  const onManageKeysPress = (): void => {
    dismissBottomSheetView();
    navigation.navigate('SecuritySettings');
  };

  const onRequestDeleteWalletPress = (): void => {
    Alert.alert(
      t('singleWallet.remove.alert.title'),
      t('singleWallet.remove.alert.description'),
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteWallet
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <BottomSheet swiperIconVisible ref={bottomSheetRef}>
      <View style={styles.container}>
        <PrimaryButton onPress={onViewRecoveryPress}>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            View Recovery Phrase
          </Text>
        </PrimaryButton>

        <PrimaryButton
          onPress={onManageKeysPress}
          colors={['#A1A6B2', '#A1A6B2']}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            Manage Access Keys
          </Text>
        </PrimaryButton>

        <SecondaryButton
          onPress={onRequestDeleteWalletPress}
          style={styles.buttonWithIcon}
        >
          <TrashIcon color={COLORS.neutral300} />
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
          >
            Remove Wallet
          </Text>
        </SecondaryButton>
        <Spacer value={32} />
      </View>
    </BottomSheet>
  );
});
