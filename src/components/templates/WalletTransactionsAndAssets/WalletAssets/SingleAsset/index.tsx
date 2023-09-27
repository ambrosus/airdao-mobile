import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset/styles';
import { useAMBPrice, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { PercentChange } from '@components/composite';
import {
  EthereumLogo,
  AirDAOTokenLogo,
  TetherLogo,
  BUSDLogo,
  USDCoinLogo,
  UndefinedTokenLogo
} from '@components/svg/icons';

interface SingleAssetProps {
  address: string;
  name: string;
  balance: { wei: string; ether: number };
}

export const SingleAsset = (props: SingleAssetProps): JSX.Element => {
  const { name, balance, address } = props;
  const usdPrice = useUSDPrice(balance.ether);
  const { data: ambTokenData } = useAMBPrice();

  const logoComponent = useMemo(() => {
    switch (name) {
      case 'AirDAO':
        return <AirDAOTokenLogo />;
      case 'Ethereum':
        return <EthereumLogo />;
      case 'BUSD Token':
        return <BUSDLogo />;
      case 'USD Coin':
        return <USDCoinLogo />;
      case 'Tether':
        return <TetherLogo />;
      case '':
        // TODO add Hera pool token logo here bcs only this token comes with empty name
        return <UndefinedTokenLogo />;
      default:
        return <AirDAOTokenLogo />;
    }
  }, [name]);

  return (
    <View style={styles.container}>
      <Row>
        {logoComponent}
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
              {NumberUtils.formatNumber(balance.ether, 2)} AMB
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
