import React, { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { Spacer, Spinner, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { SuccessIcon } from '@components/svg/icons';
import { PrimaryButton } from '@components/modular';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

interface BottomSheetImportWalletPrivateKeyStatusProps {
  status: 'initial' | 'pending' | 'error' | 'success';
}

export const BottomSheetImportWalletPrivateKeyStatus = forwardRef<
  BottomSheetRef,
  BottomSheetImportWalletPrivateKeyStatusProps
>(({ status }, ref) => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
  const bottomSheetProcessingRef = useForwardedRef<BottomSheetRef>(ref);

  const onSuccessButtonPress = useCallback(() => {
    bottomSheetProcessingRef.current?.dismiss();
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppInit' }]
        })
      );
    }, 500);
  }, [bottomSheetProcessingRef, navigation]);

  const renderBottomSheetView = useMemo(() => {
    switch (status) {
      case 'pending': {
        return (
          <View style={styles.innerContainer}>
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral900}
              style={styles.textAlignCenter}
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
              Your wallet has been imported
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

  return (
    <BottomSheet
      ref={bottomSheetProcessingRef}
      closeOnBackPress={status !== 'pending'}
      swipingEnabled={status !== 'pending'}
      swiperIconVisible={status !== 'pending'}
    >
      <Spacer value={scale(16)} />
      <View style={styles.container}>{renderBottomSheetView}</View>
      <Spacer value={scale(50)} />
    </BottomSheet>
  );
});
