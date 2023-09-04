import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
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
  USDCoinLogo
} from '@components/svg/icons';

interface SingleAssetProps {
  address: string;
  name: string;
  balance: { wei: string; ether: number };
}

export const SingleAsset = (props: SingleAssetProps): JSX.Element => {
  const { name, balance } = props;
  const usdPrice = useUSDPrice(balance.ether);
  const { data: ambTokenData } = useAMBPrice();

  let logoComponent;
  switch (name) {
    case 'AirDAO':
      logoComponent = <AirDAOTokenLogo />;
      break;
    case 'Ethereum':
      logoComponent = <EthereumLogo />;
      break;
    case 'BUSD':
      logoComponent = <BUSDLogo />;
      break;
    case 'USDCoin':
      logoComponent = <USDCoinLogo />;
      break;
    case 'Tether':
      logoComponent = <TetherLogo />;
      break;
    default:
      logoComponent = <AirDAOTokenLogo />;
      break;
  }

  return (
    <View style={styles.container}>
      <Row alignItems="center">
        {logoComponent}
        <Spacer horizontal value={scale(8)} />
        <View style={styles.item}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.nero}
            >
              {name || 'NULL'}
            </Text>
            <Text
              fontFamily="Mersad_600SemiBold"
              fontSize={16}
              color={COLORS.nero}
            >
              ${NumberUtils.formatNumber(usdPrice, 2)}
            </Text>
          </Row>
          <Spacer horizontal value={scale(8)} />
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.gray400}
            >
              {NumberUtils.formatNumber(balance.ether, 2)} AMB
            </Text>
            <Text
              fontFamily="Inter_400Regular"
              fontSize={14}
              color={COLORS.nero}
            >
              {name === 'AMB' ? (
                <PercentChange change={ambTokenData?.percentChange24H || 0} />
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
