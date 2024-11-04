import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Header } from '@components/composite';
import {
  BottomSheetPreviewSwap,
  BottomSheetTokensList,
  SwapForm
} from '@features/swap/components/templates';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { SettingsFilledIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { Button } from '@components/base';
import { useAllLiquidityPools } from '@features/swap/lib/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeParamsList } from '@appTypes';
import { useSwapAllBalances } from '@features/swap/lib/hooks/use-swap-all-balances';

type Props = NativeStackScreenProps<HomeParamsList, 'SwapScreen'>;

export const SwapScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  useSwapAllBalances();

  useAllLiquidityPools();
  const {
    bottomSheetTokenARef,
    bottomSheetTokenBRef,
    bottomSheetPreviewSwapRef,
    reset
  } = useSwapContextSelector();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        const resetActions = ['RESET', 'GO_BACK'];
        if (resetActions.includes(e.data.action.type)) reset();
      });

      return unsubscribe;
    }, [navigation, reset])
  );

  const onNavigateToSwapSettings = useCallback(
    () => navigation.navigate('SwapSettingsScreen'),
    [navigation]
  );

  const renderHeaderRightContent = useMemo(() => {
    return (
      <Button onPress={onNavigateToSwapSettings}>
        <SettingsFilledIcon color={COLORS.neutral400} />
      </Button>
    );
  }, [onNavigateToSwapSettings]);

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
      <BottomSheetPreviewSwap ref={bottomSheetPreviewSwapRef} />
    </SafeAreaView>
  );
};
