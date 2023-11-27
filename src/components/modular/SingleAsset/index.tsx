import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useAMBPrice, useUSDPrice } from '@hooks';
import { PercentChange } from '@components/composite';
import { Token } from '@models';
import { TokenLogo, TokenLogoProps } from '../TokenLogo';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';

interface SingleAssetProps {
  token: Token;
  overrideIconVariants?: TokenLogoProps['overrideIconVariants'];
}

export const SingleAsset = (props: SingleAssetProps): JSX.Element => {
  const { token, overrideIconVariants } = props;
  const { name, balance, symbol, address } = token;
  const usdPrice = useUSDPrice(balance.ether, symbol);
  const { data: ambTokenData } = useAMBPrice();

  return (
    <View style={styles.container}>
      <Row>
        <View style={{ alignSelf: 'center' }}>
          <TokenLogo token={name} overrideIconVariants={overrideIconVariants} />
        </View>
        <Spacer horizontal value={scale(8)} />
        <View style={styles.item}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {name === '' ? 'Unknown token' : name || address}
            </Text>
            <Text
              fontFamily="Mersad_600SemiBold"
              fontSize={16}
              color={COLORS.neutral800}
            >
              ${NumberUtils.limitDecimalCount(usdPrice, 2)}
            </Text>
          </Row>
          <Spacer horizontal value={scale(8)} />
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.neutral400}
            >
              {NumberUtils.limitDecimalCount(balance.ether, 2)}{' '}
              {symbol || 'tokens'}
            </Text>
            <Text
              fontFamily="Inter_400Regular"
              fontSize={14}
              color={COLORS.neutral800}
            >
              {name === 'AMB' ? (
                <View style={{ paddingTop: verticalScale(3) }}>
                  <PercentChange
                    change={ambTokenData?.percentChange24H || 0}
                    fontSize={14}
                  />
                </View>
              ) : (
                ''
              )}
            </Text>
          </Row>
        </View>
      </Row>
    </View>
  );
};
