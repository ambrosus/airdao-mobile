import { useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeParamsList } from '@appTypes';
import { Button } from '@components/base';
import { Header } from '@components/composite';
import { SettingsFilledIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import {
  BottomSheetPreviewSwap,
  BottomSheetTokensList,
  SwapForm
} from '@features/swap/components/templates';
import { useSwapContextSelector } from '@features/swap/context';
import { useAllLiquidityPools } from '@features/swap/lib/hooks';
import { useSwapAllBalances } from '@features/swap/lib/hooks/use-swap-all-balances';
import { FIELD } from '@features/swap/types';
import { styles } from './styles';

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
