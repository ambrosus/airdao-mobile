import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import { InputWithIcon } from '@components/composite';
import { Row, Text } from '@components/base';
import { PrimaryButton, TokenLogo } from '@components/modular';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { COLORS } from '@constants/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  AnimatedStyleProp
} from 'react-native-reanimated';

interface BuyBondTabProps {
  market: MarketType;
}

const useAnimatedFooterSpacer = (
  isActive: boolean
): AnimatedStyleProp<{ marginTop: number }> => {
  const marginTop = useSharedValue(isActive ? 8 : 234);
  const marginBottom = useSharedValue(isActive ? 0 : 230);

  useEffect(() => {
    marginTop.value = withTiming(isActive ? 8 : 234, { duration: 500 });
    marginBottom.value = withTiming(isActive ? 0 : 230, { duration: 500 });
  }, [isActive, marginBottom, marginTop]);

  return useAnimatedStyle(() => {
    return {
      marginTop: marginTop.value
    };
  });
};

export const BuyBondTab = ({ market }: BuyBondTabProps) => {
  const { quoteToken } = useMarketDetails(market);
  const [leftInputContentWidth, setLeftInputContentWidth] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const animatedStyle = useAnimatedFooterSpacer(isActive);

  const onRenderInputLeftContentLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;

      setLeftInputContentWidth(width);
    },
    []
  );

  const renderInputLeftContent = useMemo(() => {
    return (
      <View
        onLayout={onRenderInputLeftContentLayoutHandler}
        style={styles.inputLeftContainer}
      >
        <TokenLogo scale={0.65} token={quoteToken?.symbol ?? ''} />
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.alphaBlack60}
        >
          {quoteToken?.symbol}
        </Text>
      </View>
    );
  }, [onRenderInputLeftContentLayoutHandler, quoteToken?.symbol]);

  const onFocusHandle = () => {
    setIsActive(true);
  };
  const onBlurHandle = () => setIsActive(false);

  return (
    <>
      <View style={styles.innerContainer}>
        <View style={styles.inputWithHeadingContainer}>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            Amount
          </Text>
          <InputWithIcon
            keyboardType="numeric"
            style={styles.input}
            onFocus={onFocusHandle}
            onBlur={onBlurHandle}
            placeholder="0"
            placeholderTextColor={COLORS.alphaBlack60}
            iconLeft={renderInputLeftContent}
            spacingLeft={leftInputContentWidth}
            spacingRight={0}
          />
        </View>

        <View style={styles.balance}>
          <Text>Balance: 20,000 AMB Max</Text>
        </View>

        <View style={styles.details}>
          <Row alignItems="center" justifyContent="space-between">
            <Text>Max bondable:</Text>
            <Text>123</Text>
          </Row>
          <Row alignItems="center" justifyContent="space-between">
            <Text>Max bondable:</Text>
            <Text>123</Text>
          </Row>
        </View>
      </View>

      <Animated.View style={[styles.footer, animatedStyle]}>
        <PrimaryButton style={styles.button} onPress={() => null}>
          <Text>Select</Text>
        </PrimaryButton>
      </Animated.View>
    </>
  );
};
