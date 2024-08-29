import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import { useTransactionErrorHandler } from '@features/kosmos/lib/hooks';
import { View } from 'react-native';

interface ReviewBondPurchaseButtonProps {
  market: MarketType;
  onPreviewPurchase: () => void;
}

export const ReviewBondPurchaseButton = ({
  market,
  onPreviewPurchase
}: ReviewBondPurchaseButtonProps) => {
  const { t } = useTranslation();
  const { error } = useTransactionErrorHandler(market);
  const { amountToBuy } = useKosmosMarketsContextSelector();

  const onPreviewPurchasePress = useCallback(
    async () => onPreviewPurchase(),
    [onPreviewPurchase]
  );

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '' || !market.isLive,
    [amountToBuy, error, market.isLive]
  );

  const label = useMemo(
    () =>
      !market.isLive
        ? t('kosmos.button.market.closed')
        : disabled
        ? t('kosmos.button.enter.amount')
        : t('button.preview'),
    [disabled, market.isLive, t]
  );

  const textColor = useMemo(() => {
    return disabled ? COLORS.alphaBlack30 : COLORS.neutral0;
  }, [disabled]);

  return (
    <View style={styles.footer}>
      <PrimaryButton
        disabled={disabled}
        style={styles.button}
        onPress={onPreviewPurchasePress}
      >
        <Text fontSize={16} fontFamily="Inter_500Medium" color={textColor}>
          {label}
        </Text>
      </PrimaryButton>
    </View>
  );
};
