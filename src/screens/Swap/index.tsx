import React, { useCallback, useMemo, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { BottomSheetRef, Header } from '@components/composite';
import {
  BottomSheetPreviewSwap,
  BottomSheetSwapSettings,
  BottomSheetTokensList,
  SwapForm
} from '@features/swap/components/templates';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { SettingsFilledIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { Button } from '@components/base';
import { useAllLiquidityPools } from '@features/swap/lib/hooks';

export const SwapScreen = () => {
  const { t } = useTranslation();
  const bottomSheetSwapSettingsRef = useRef<BottomSheetRef>(null);
  useAllLiquidityPools();
  const {
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef,
    reset
  } = useSwapContextSelector();

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [reset])
  );

  const onShowBottomSheetSwapSettings = useCallback(() => {
    bottomSheetSwapSettingsRef.current?.show();
  }, []);

  const renderHeaderRightContent = useMemo(() => {
    return (
      <Button onPress={onShowBottomSheetSwapSettings}>
        <SettingsFilledIcon color={COLORS.neutral400} />
      </Button>
    );
  }, [onShowBottomSheetSwapSettings]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        title={t('account.actions.swap')}
        contentRight={renderHeaderRightContent}
      />

      <SwapForm />

      <BottomSheetTokensList ref={bottomSheetTokenARef} type={FIELD.TOKEN_A} />
      <BottomSheetTokensList ref={bottomSheetTokenBRef} type={FIELD.TOKEN_B} />
      <BottomSheetSwapSettings ref={bottomSheetSwapSettingsRef} />
      <BottomSheetPreviewSwap ref={bottomSheetPreviewSwapRef} />
    </SafeAreaView>
  );
};
