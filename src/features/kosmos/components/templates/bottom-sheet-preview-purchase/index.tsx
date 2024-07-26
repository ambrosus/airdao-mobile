import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { TokenLogo } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { ethers } from 'ethers';
import {
  formatDecimals,
  timestampToFormatedDate
} from '@features/kosmos/utils';
import { upperCase } from 'lodash';
import { BuyBondButton } from '../../modular';
import { StakePending } from '@screens/StakingPool/components';

interface BottomSheetPreviewPurchaseProps {
  market: MarketType;
}

export const BottomSheetPreviewPurchase = forwardRef<
  BottomSheetRef,
  BottomSheetPreviewPurchaseProps
>(({ market }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  const { amountToBuy } = useKosmosMarketsContextSelector();
  const { payoutToken, quoteToken, willGetSubFee, protocolFee } =
    useMarketDetails(market);
  const { tokens } = useKosmosMarketsContextSelector();

  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);

  const formattedWillGetSubFee = useMemo(() => {
    if (!willGetSubFee) return '';
    return +ethers.utils.formatUnits(willGetSubFee, quoteToken?.decimals);
  }, [quoteToken?.decimals, willGetSubFee]);

  const calculatedProtocolFee = useMemo(() => {
    return (+amountToBuy * protocolFee) / 100;
  }, [amountToBuy, protocolFee]);

  const onDismissBottomSheet = useCallback(
    () => bottomSheetRef.current?.dismiss(),
    [bottomSheetRef]
  );

  return (
    <BottomSheet
      swiperIconVisible={!isTransactionProcessing}
      swipingEnabled={!isTransactionProcessing}
      ref={bottomSheetRef}
    >
      <View style={styles.container}>
        {isTransactionProcessing ? (
          <StakePending />
        ) : (
          <View style={styles.innerContainer}>
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
              style={styles.heading}
            >
              Preview
            </Text>

            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>You’re buying</StyledTextItem>
              <Row style={styles.bondsRowGap} alignItems="center">
                <TokenLogo scale={0.5} token={quoteToken?.symbol ?? ''} />
                <StyledTextItem isValue>
                  {amountToBuy} {quoteToken?.symbol}
                </StyledTextItem>
              </Row>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>You will get</StyledTextItem>
              <StyledTextItem isValue>
                {amountToBuy
                  ? formatDecimals(
                      formattedWillGetSubFee,
                      payoutToken?.contractAddress,
                      tokens
                    )
                  : '-'}{' '}
                {payoutToken?.symbol.toUpperCase()}
              </StyledTextItem>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>Discount</StyledTextItem>
              <StyledTextItem isValue>
                {market.discount.toFixed(2)}%
              </StyledTextItem>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>Lock period</StyledTextItem>
              <StyledTextItem isValue>
                {timestampToFormatedDate(market.start)}
                {' - '}
                {timestampToFormatedDate(market.conclusion)}
              </StyledTextItem>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>Protocol fee</StyledTextItem>
              <StyledTextItem isValue>
                {calculatedProtocolFee.toFixed()}{' '}
                {upperCase(quoteToken?.symbol)}
              </StyledTextItem>
            </Row>
            <BuyBondButton
              onDismissBottomSheet={onDismissBottomSheet}
              setIsTransactionProcessing={setIsTransactionProcessing}
              market={market}
            />
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

const StyledTextItem = ({
  children,
  isValue = false
}: {
  children: ReactNode;
  isValue?: boolean;
}) => {
  const color = isValue ? COLORS.neutral800 : COLORS.neutral400;

  return (
    <Text fontSize={16} fontFamily="Inter_500Medium" color={color}>
      {children}
    </Text>
  );
};
