import { API } from '@api/api';
import { SettingsTabParamsList } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { TrashIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { WalletDBModel } from '@database';
import { useForwardedRef } from '@hooks';
import { ExplorerAccount } from '@models';
import {
  CommonActions,
  NavigationProp,
  useNavigation
} from '@react-navigation/native';
import { WalletUtils } from '@utils/wallet';
import React, { ForwardedRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { styles } from './styles';

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

  const dismissBottomSheetView = () => bottomSheetRef.current?.dismiss();

  const deleteWallet = () => {
    dismissBottomSheetView();

    setTimeout(async () => {
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
    }, 500);
  };

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
