import React, { forwardRef, useCallback, useMemo } from 'react';
import { InteractionManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { SuccessIcon } from '@components/svg/icons';
import { PrimaryButton } from '@components/modular';
import { HomeNavigationProp } from '@appTypes';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils/scaling';
import { delay } from '@utils/delay';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';

interface BottomSheetImportWalletPrivateKeyStatusProps {
  status: 'initial' | 'pending' | 'error' | 'success';
}

export const BottomSheetImportWalletPrivateKeyStatus = forwardRef<
  BottomSheetRef,
  BottomSheetImportWalletPrivateKeyStatusProps
>(({ status }, ref) => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
  const { isPasscodeEnabled } = usePasscodeStore();
  const bottomSheetProcessingRef = useForwardedRef<BottomSheetRef>(ref);

  const onSuccessButtonPress = useCallback(async () => {
    bottomSheetProcessingRef.current?.dismiss();

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(async () => {
        await delay(500);
        if (isPasscodeEnabled) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Tabs', params: { screen: 'Wallets' } }]
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Tabs',
                  params: {
                    screen: 'Wallets',
                    params: {
                      screen: 'SetupPasscode'
                    }
                  }
                }
              ]
            })
          );
        }
      });
    });
  }, [bottomSheetProcessingRef, isPasscodeEnabled, navigation]);

  const onBottomSheetClose = useCallback(async () => {
    if (status === 'success') onSuccessButtonPress();
  }, [status, onSuccessButtonPress]);

  const renderBottomSheetView = useMemo(() => {
    switch (status) {
      case 'pending': {
        return (
          <View style={styles.innerContainer}>
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral900}
              style={[styles.textAlignCenter, styles.headingLineHeight]}
            >
              {t('import.wallet.loading')}
            </Text>
            <Spacer value={scale(24)} />
            <Spinner />
          </View>
        );
      }
      case 'success': {
        return (
          <View style={styles.innerContainer}>
            <SuccessIcon />
            <Spacer value={scale(8)} />
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral900}
              style={styles.textAlignCenter}
            >
              {t('staking.pool.success')}
            </Text>
            <Spacer value={scale(8)} />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral600}
              style={styles.textAlignCenter}
            >
              {t('import.wallet.key.success')}
            </Text>
            <Spacer value={scale(32)} />
            <PrimaryButton onPress={onSuccessButtonPress}>
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral0}
              >
                {t('button.start.using.wallet')}
              </Text>
            </PrimaryButton>
          </View>
        );
      }
    }
  }, [onSuccessButtonPress, status, t]);

  const stateToDisableBackPress = useMemo(() => {
    return status !== 'pending' && status !== 'success';
  }, [status]);

  return (
    <BottomSheet
      avoidKeyboard
      ref={bottomSheetProcessingRef}
      onBackdropPress={onBottomSheetClose}
      closeOnBackPress={stateToDisableBackPress}
      swipingEnabled={status !== 'pending'}
      swiperIconVisible={status !== 'pending'}
    >
      <Spacer value={scale(16)} />
      <View style={styles.container}>{renderBottomSheetView}</View>
      <Spacer value={scale(50)} />
    </BottomSheet>
  );
});
