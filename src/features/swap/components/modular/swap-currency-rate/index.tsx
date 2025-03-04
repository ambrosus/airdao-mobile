import { memo, useEffect, useMemo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Row, Spinner } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
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
  tokenToReceive
}: SwapCurrencyRateProps) => {
  const { isExecutingPrice } = useSwapContextSelector();
  const {
    bestSwapRate,
    onToggleTokensOrder,
    tokens,
    isExecutingRate,
    rate,
    setRate
  } = useSwapBetterRate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tokenToSell && tokenToReceive && !isExecutingPrice) {
        const executedTokensRate = bestSwapRate();

        if (!!executedTokensRate) {
          setRate(executedTokensRate);
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [bestSwapRate, tokenToReceive, tokenToSell, isExecutingPrice, setRate]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      height: 52,
      paddingBottom: verticalScale(20)
    };
  }, []);

  const transformedCurrencyRate = useMemo(
    () => SwapStringUtils.transformCurrencyRate(+rate),
    [rate]
  );

  return (
    <Row style={containerStyle} justifyContent="center" alignItems="center">
      {isExecutingRate || typeof rate === 'number' ? (
        <Spinner customSize={17.5} />
      ) : (
        <TouchableOpacity onPress={onToggleTokensOrder}>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand500}
          >
            1 {tokens.symbolInput ?? 'AMB'} = {transformedCurrencyRate}{' '}
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
