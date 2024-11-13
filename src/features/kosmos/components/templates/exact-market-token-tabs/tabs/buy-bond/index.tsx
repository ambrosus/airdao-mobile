import React, { useCallback, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  TouchableOpacity,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { COLORS } from '@constants/colors';
import { ReviewBondPurchaseButton } from '@features/kosmos/components/modular';
import { discountColor } from '@features/kosmos/utils';
import { BottomSheetPreviewPurchase } from '../../../bottom-sheet-preview-purchase';
import { BottomSheetRef } from '@components/composite';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { isAndroid } from '@utils/isPlatform';
import { InputWithTokenSelect } from '@components/templates';
import { Token } from '@models';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

interface BuyBondTabProps {
  market: MarketType | undefined;
  scrollToInput: () => any;
  calculateMaximumAvailableAmount: (balance: string) => void;
}

const INITIAL_PADDING_VALUE = 74;

export const BuyBondTab = ({
  market,
  scrollToInput,
  calculateMaximumAvailableAmount
}: BuyBondTabProps) => {
  const { t } = useTranslation();
  const [isActiveInput, setIsActiveInput] = useState(false);

  const { amountToBuy, onChangeAmountToBuy } =
    useKosmosMarketsContextSelector();

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
  const inputRef = useRef(null);

  const onInputPress = useCallback(() => {
    if (isAndroid) {
      setIsActiveInput(true);
      InteractionManager.runAfterInteractions(() => {
        scrollToInput();
        // @ts-ignore
        setTimeout(() => inputRef?.current?.focus(), 200);
      });
    }
  }, [scrollToInput]);

  const onFocusHandle = () => {
    setAnimatedMargin({ paddingTop: 0, paddingBottom: INITIAL_PADDING_VALUE });
  };
  const onBlurHandle = () => {
    setAnimatedMargin({ paddingTop: INITIAL_PADDING_VALUE, paddingBottom: 0 });
    setIsActiveInput(false);
  };

  const onPressMaxAmount = useCallback(
    (balance?: string) => {
      if (!balance || +balance <= 0) return;

      return calculateMaximumAvailableAmount(balance);
    },
    [calculateMaximumAvailableAmount]
  );

  return (
    <>
      <View style={styles.innerContainer}>
        <View style={styles.inputWithHeadingContainer}>
          <View style={{ zIndex: 0 }}>
            <InputWithTokenSelect
              label="Set amount"
              title="Set amount"
              value={amountToBuy}
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
        {/* <Spacer value={50} /> */}
      </Animated.View>
      <BottomSheetPreviewPurchase ref={bottomSheetRef} market={market} />
    </>
  );
};
