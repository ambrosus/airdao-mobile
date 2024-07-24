import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { COLORS } from '@constants/colors';
import {
  BalanceWithButton,
  BuyBondButton
} from '@features/kosmos/components/modular';
import { discountColor } from '@features/kosmos/utils';
import { BuyBondInputWithError } from '@features/kosmos/components/composite';
import { useReanimatedStyle } from './hooks/use-reanimated-style';

interface BuyBondTabProps {
  market: MarketType;
}

export const BuyBondTab = ({ market }: BuyBondTabProps) => {
  const { quoteToken, payoutToken, maxBondable, discount } =
    useMarketDetails(market);

  const [isActive, setIsActive] = useState(false);

  const onFocusHandle = () => setIsActive(true);
  const onBlurHandle = () => setIsActive(false);

  const animatedStyle = useReanimatedStyle(isActive);

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
          <BuyBondInputWithError
            onFocus={onFocusHandle}
            onBlur={onBlurHandle}
            quoteToken={quoteToken}
            market={market}
          />
        </View>

        <View style={styles.balance}>
          <BalanceWithButton qouteToken={quoteToken} />
        </View>

        <View style={styles.details}>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
            >
              Max bondable:
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
              Discount
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

      <BuyBondButton animatedStyle={animatedStyle} market={market} />
    </>
  );
};
