import React, { useCallback, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  LayoutChangeEvent,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { InputRef, Row, Text } from '@components/base';

import {
  useMarketDetails,
  useTransactionErrorHandler
} from '@features/kosmos/lib/hooks';
import { COLORS } from '@constants/colors';
import { ReviewBondPurchaseButton } from '@features/kosmos/components/modular';
import { $discount, discountColor } from '@features/kosmos/utils';
import { usePurchaseStore } from '@features/kosmos';
import { BottomSheetPreviewPurchase } from '../../../bottom-sheet-preview-purchase';
import { BottomSheetRef } from '@components/composite';
import { InputWithTokenSelect } from '@components/templates';
import { Token } from '@models';
import { NumberUtils, isAndroid, isIos } from '@utils';
import { MarketType } from '@entities/kosmos';

interface BuyBondTabProps {
  market: MarketType | undefined;
  scrollToInput: () => any;
  calculateMaximumAvailableAmount: (balance: string) => void;
  userPerformedRefresh: boolean;
  onScrollToTop: () => void;
  onHandleBuyBondsLayoutChange: (event: LayoutChangeEvent) => void;
}

const INITIAL_PADDING_VALUE = 74;

export const BuyBondTab = ({
  market,
  scrollToInput,
  calculateMaximumAvailableAmount,
  userPerformedRefresh,
  onScrollToTop,
  onHandleBuyBondsLayoutChange
}: BuyBondTabProps) => {
  const { t } = useTranslation();
  const [isActiveInput, setIsActiveInput] = useState(false);
  const { error } = useTransactionErrorHandler(market);

  const inputRef = useRef<InputRef>(null);

  const { amountToBuy, onChangeAmountToBuy } = usePurchaseStore();

  const { quoteToken, payoutToken, maxBondable } = useMarketDetails(market);

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
      paddingTop: withTiming(
        isIos ? animatedPaddingTop.value : animatedPaddingTop.value / 1.25
      )
    };
  });

  const paddingBottom = useAnimatedStyle(() => {
    return {
      paddingBottom: withTiming(animatedPaddingBottom.value)
    };
  });

  const setAnimatedMargin = useCallback(
    (padding: { paddingTop: number; paddingBottom: number }) => {
      const { paddingTop, paddingBottom } = padding;
      animatedPaddingTop.value = withTiming(paddingTop, {
        duration: 0
      });
      animatedPaddingBottom.value = withTiming(paddingBottom, {
        duration: 0
      });
    },
    [animatedPaddingBottom, animatedPaddingTop]
  );

  const onInputPress = useCallback(() => {
    if (isAndroid) {
      setIsActiveInput(true);
      InteractionManager.runAfterInteractions(() => {
        scrollToInput();
        setTimeout(() => inputRef?.current?.focus(), 200);
      });
    }
  }, [scrollToInput]);

  const onFocusHandle = useCallback(
    () =>
      setAnimatedMargin({
        paddingTop: 24,
        paddingBottom: INITIAL_PADDING_VALUE
      }),
    [setAnimatedMargin]
  );

  const onBlurHandle = useCallback(() => {
    onScrollToTop();
    setAnimatedMargin({ paddingTop: INITIAL_PADDING_VALUE, paddingBottom: 0 });
    setIsActiveInput(false);
  }, [onScrollToTop, setAnimatedMargin]);

  const onPressMaxAmount = useCallback(
    (balance?: string) => {
      if (!balance || +balance <= 0) return;

      return calculateMaximumAvailableAmount(balance);
    },
    [calculateMaximumAvailableAmount]
  );

  return (
    <>
      <View
        style={styles.innerContainer}
        onLayout={onHandleBuyBondsLayoutChange}
      >
        <View style={styles.inputWithHeadingContainer}>
          <View style={styles.zIndex}>
            <InputWithTokenSelect
              label="Set amount"
              title="Set amount"
              error={error}
              value={amountToBuy}
              isRequiredRefetchBalance={userPerformedRefresh}
              onChangeText={onChangeAmountToBuy}
              onFocus={onFocusHandle}
              onBlur={onBlurHandle}
              dispatch={false}
              onPressMaxAmount={(value) => onPressMaxAmount(value)}
              token={
                {
                  symbol: quoteToken?.symbol,
                  address: quoteToken?.contractAddress
                } as unknown as Token
              }
              selectable={false}
            />
          </View>
          {!isActiveInput && isAndroid && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onInputPress}
              style={styles.inputButton}
            />
          )}
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
              {NumberUtils.numberToTransformedLocale(maxBondable)}{' '}
              {payoutToken?.symbol}
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
              color={discountColor(market?.discount)}
            >
              {$discount(market?.discount)}
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
