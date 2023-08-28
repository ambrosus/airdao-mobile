import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { AssetLogo } from '@components/svg/icons/Asset';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset/styles';
import { ExplorerAccount } from '@models';
import { useExplorerInfo, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';

interface SingleAssetProps {
  asset: ExplorerAccount;
}

export const SingleAsset = (props: SingleAssetProps): JSX.Element => {
  const { asset } = props;
  const usdPrice = useUSDPrice(asset?.ambBalance || 0);
  const { data: infoData } = useExplorerInfo();

  return (
    <View style={styles.container}>
      <Row>
        <AssetLogo />
        <Spacer horizontal value={scale(8)} />
        <View style={styles.item}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.nero}
            >
              AirDAO
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
              {NumberUtils.formatNumber(asset.ambBalance, 2)} AMB
            </Text>
            <Text
              fontFamily="Inter_400Regular"
              fontSize={14}
              color={COLORS.nero}
            >
              %
              {NumberUtils.formatNumber(
                asset.calculatePercentHoldings(infoData?.totalSupply || 1),
                2
              )}
            </Text>
          </Row>
        </View>
      </Row>
    </View>
  );
};
