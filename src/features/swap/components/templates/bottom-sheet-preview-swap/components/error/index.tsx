import React, { useCallback } from 'react';
import { InteractionManager, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { BottomSheetStatus } from '@features/swap/types';
import { COLORS } from '@constants/colors';
import { ErrorIcon } from '@components/svg/icons/v2';
import { cssShadowToNative, verticalScale, _delayNavigation } from '@utils';

export const ErrorSwapView = () => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();

  const { onReviewSwapDismiss, onChangeBottomSheetSwapStatus } =
    useSwapBottomSheetHandler();

  const onRepeatTransaction = useCallback(() => {
    onReviewSwapDismiss();
    InteractionManager.runAfterInteractions(() =>
      onChangeBottomSheetSwapStatus(BottomSheetStatus.PREVIEW)
    );
  }, [onChangeBottomSheetSwapStatus, onReviewSwapDismiss]);

  const onNavigateToWallets = () => {
    onChangeBottomSheetSwapStatus(BottomSheetStatus.PREVIEW);
    _delayNavigation(onReviewSwapDismiss, () =>
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }]
        })
      )
    );
  };

  return (
    <View style={styles.container}>
      <ErrorIcon />
      <Spacer value={verticalScale(16)} />
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('send.funds.failed')}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        fontSize={17}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral500}
        style={styles.description}
        align="center"
      >
        {t('bridge.transfer.failed.sub.header')}
      </Text>
      <View style={styles.footer}>
        <PrimaryButton
          style={{
            ...cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)')
          }}
          onPress={onRepeatTransaction}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            {t('button.try.again')}
          </Text>
        </PrimaryButton>

        <SecondaryButton
          onPress={onNavigateToWallets}
          style={styles.secondaryButton}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand600}
          >
            Done
          </Text>
        </SecondaryButton>
      </View>
    </View>
  );
};
