import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useAMBPrice, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { PercentChange } from '@components/composite';
import { TokenDTO } from '@models';
import { TokenLogo } from '../TokenLogo';
import { styles } from './styles';

interface SingleAssetProps {
  token: TokenDTO;
}

export const SingleAsset = (props: SingleAssetProps): JSX.Element => {
  const { token } = props;
  const { name, balance, symbol, address } = token;
  const usdPrice = useUSDPrice(balance.ether);
  const { data: ambTokenData } = useAMBPrice();

  return (
    <View style={styles.container}>
      <Row>
        <View style={{ alignSelf: 'center' }}>
          {
            <TokenLogo
              token={name}
              style={{ width: moderateScale(32), height: moderateScale(32) }}
            />
          }
        </View>
        <Spacer horizontal value={scale(8)} />
        <View style={styles.item}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {name === '' ? 'Hera pool token' : name || address}
            </Text>
            <Text
              fontFamily="Mersad_600SemiBold"
              fontSize={16}
              color={COLORS.neutral800}
            >
              ${NumberUtils.formatNumber(usdPrice, 2)}
            </Text>
          </Row>
          <Spacer horizontal value={scale(8)} />
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.neutral400}
            >
              {NumberUtils.formatNumber(balance.ether, 2)} {symbol}
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
