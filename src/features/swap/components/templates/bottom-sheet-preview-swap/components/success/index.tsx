import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapBottomSheetHandler } from '@features/swap/lib/hooks';
import { BottomSheetStatus } from '@features/swap/types';
import { COLORS } from '@constants/colors';
import { SuccessIcon } from '@components/svg/icons/v2';
import { verticalScale } from '@utils/scaling';
import { cssShadowToNative } from '@utils/css-shadow-to-native';
import { _delayNavigation } from '@utils/navigate';

export const SuccessSwapView = () => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();
  const { onReviewSwapDismiss, onChangeBottomSheetSwapStatus } =
    useSwapBottomSheetHandler();

  const onNavigateToWallets = async () => {
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

  const description = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;
    return t('swap.status.success.desc', {
      AMOUNT_A,
      SYMBOL_A: TOKEN_A?.symbol,
      AMOUNT_B,
      SYMBOL_B: TOKEN_B?.symbol
    });
  }, [selectedTokens, selectedTokensAmount, t]);

  return (
    <View style={styles.container}>
      <SuccessIcon />
      <Spacer value={verticalScale(16)} />
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        Transaction confirmed.
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        fontSize={17}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral500}
        style={styles.description}
        align="center"
      >
        {description}
      </Text>
      <View style={styles.footer}>
        <PrimaryButton
          style={{
            ...cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)')
          }}
          onPress={onNavigateToWallets}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            {t('common.done')}
          </Text>
        </PrimaryButton>
      </View>
    </View>
  );
};
