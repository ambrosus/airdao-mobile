import { memo, useEffect, useMemo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Row, Spinner } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapBetterRate } from '@features/swap/lib/hooks';
import { SwapStringUtils } from '@features/swap/utils';
import { verticalScale } from '@utils';

interface SwapCurrencyRateProps {
  tokenToSell: string;
  tokenToReceive: string;
  tokensRoute: string[];
}

const _SwapCurrencyRate = ({
  tokenToSell,
  tokenToReceive,
  tokensRoute
}: SwapCurrencyRateProps) => {
  const {
    bestSwapRate,
    onToggleTokensOrder,
    tokens,
    isExecutingRate,
    oppositeAmountPerOneToken,
    setOppositeAmountPerOneToken
  } = useSwapBetterRate();

  useEffect(() => {
    (async () => {
      if (tokenToSell && tokenToReceive) {
        const ratePerToken = await bestSwapRate(tokensRoute);

        if (ratePerToken) {
          const normalizedAmount =
            SwapStringUtils.transformCurrencyRate(ratePerToken);

          setOppositeAmountPerOneToken(normalizedAmount);
        }
      }
    })();
  }, [
    bestSwapRate,
    setOppositeAmountPerOneToken,
    tokenToReceive,
    tokenToSell,
    tokensRoute
  ]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      height: 52,
      paddingBottom: verticalScale(20)
    };
  }, []);

  return (
    <Row style={containerStyle} justifyContent="center" alignItems="center">
      {isExecutingRate || oppositeAmountPerOneToken === '0' ? (
        <Spinner customSize={17.5} />
      ) : (
        <TouchableOpacity onPress={onToggleTokensOrder}>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand500}
          >
            1 {tokens.symbolInput ?? 'AMB'} = {oppositeAmountPerOneToken}{' '}
            {tokens.symbolOutput}
          </Text>
        </TouchableOpacity>
      )}
    </Row>
  );
};

export const SwapCurrencyRate = memo(
  _SwapCurrencyRate,
  (prevProps, nextProps) =>
    prevProps.tokenToReceive === nextProps.tokenToReceive &&
    prevProps.tokenToSell === nextProps.tokenToSell
);
