import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { COLORS } from '@constants/colors';
import {
  BalanceWithButton,
  ReviewBondPurchaseButton
} from '@features/kosmos/components/modular';
import { discountColor } from '@features/kosmos/utils';
import { BuyBondInputWithError } from '@features/kosmos/components/composite';
import { useReanimatedStyle } from './hooks/use-reanimated-style';
import { BottomSheetPreviewPurchase } from '../../../bottom-sheet-preview-purchase';
import { BottomSheetRef } from '@components/composite';

interface BuyBondTabProps {
  market: MarketType;
}

export const BuyBondTab = ({ market }: BuyBondTabProps) => {
  const { t } = useTranslation();

  const { quoteToken, payoutToken, maxBondable, discount } =
    useMarketDetails(market);

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [isActive, setIsActive] = useState(false);

  const onFocusHandle = () => setIsActive(true);
  const onBlurHandle = () => setIsActive(false);

  const animatedStyle = useReanimatedStyle(isActive);

  const onPreviewPurchase = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      bottomSheetRef.current?.show();
    }, 500);
  }, []);

  return (
    <>
      <View style={styles.innerContainer}>
        <View style={styles.inputWithHeadingContainer}>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {t('common.transaction.amount')}
          </Text>
          <BuyBondInputWithError
            onFocus={onFocusHandle}
            onBlur={onBlurHandle}
            quoteToken={quoteToken}
            market={market}
          />
        </View>

        <View style={styles.balance}>
          <BalanceWithButton qouteToken={quoteToken} market={market} />
        </View>

        <View style={styles.details}>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
            >
              {t('kosmos.max.bondable')}:
            </Text>
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral90}
            >
              {maxBondable} {payoutToken?.symbol}
            </Text>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
            >
              {t('kosmos.table.headings.discount')}
            </Text>
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={discountColor(+discount)}
            >
              {discount}%
            </Text>
          </Row>
        </View>
      </View>

      <ReviewBondPurchaseButton
        animatedStyle={animatedStyle}
        market={market}
        onPreviewPurchase={onPreviewPurchase}
      />
      <BottomSheetPreviewPurchase ref={bottomSheetRef} market={market} />
    </>
  );
};
