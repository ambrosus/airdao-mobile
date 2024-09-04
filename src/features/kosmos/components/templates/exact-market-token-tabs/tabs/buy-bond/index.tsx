import React, { useCallback, useRef } from 'react';
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
import { BottomSheetPreviewPurchase } from '../../../bottom-sheet-preview-purchase';
import { BottomSheetRef } from '@components/composite';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface BuyBondTabProps {
  market: MarketType | undefined;
}

const INITIAL_PADDING_VALUE = 234;

export const BuyBondTab = ({ market }: BuyBondTabProps) => {
  const { t } = useTranslation();

  const { quoteToken, payoutToken, maxBondable, discount } =
    useMarketDetails(market);

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const onPreviewPurchase = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      bottomSheetRef.current?.show();
    }, 500);
  }, []);

  const animatedPaddingTop = useSharedValue(INITIAL_PADDING_VALUE);
  const animatedPaddingBottom = useSharedValue(0);
  const paddingTop = useAnimatedStyle(() => {
    return {
      paddingTop: withTiming(animatedPaddingTop.value)
    };
  });
  const paddingBottom = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(animatedPaddingBottom.value)
    };
  });

  const setAnimatedMargin = (padding: {
    paddingTop: number;
    paddingBottom: number;
  }) => {
    animatedPaddingTop.value = withTiming(padding.paddingTop, {
      duration: 0
    });
    animatedPaddingBottom.value = withTiming(padding.paddingBottom, {
      duration: 0
    });
  };

  const onFocusHandle = () =>
    setAnimatedMargin({ paddingTop: 0, paddingBottom: INITIAL_PADDING_VALUE });
  const onBlurHandle = () =>
    setAnimatedMargin({ paddingTop: INITIAL_PADDING_VALUE, paddingBottom: 0 });

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
          <BalanceWithButton quoteToken={quoteToken} market={market} />
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
      <Animated.View style={[paddingTop, paddingBottom]}>
        <ReviewBondPurchaseButton
          market={market}
          onPreviewPurchase={onPreviewPurchase}
        />
      </Animated.View>
      <BottomSheetPreviewPurchase ref={bottomSheetRef} market={market} />
    </>
  );
};
