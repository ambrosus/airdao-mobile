import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks';
import { PercentChange } from '@components/composite';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { AddressIndicator } from '../AddressIndicator';

interface WalletItemProps {
  item: ExplorerAccount;
  indicatorVisible?: boolean; // show info whether address is watchlisted or added to collection
}

function WalletItemView(props: WalletItemProps): JSX.Element {
  const { item, indicatorVisible } = props;
  const { data: ambTokenData } = useAMBPrice();
  const usdBalance = item.ambBalance * (ambTokenData?.priceUSD || 0);
  return (
    <View style={{ justifyContent: 'space-between' }}>
      <Row justifyContent="space-between">
        <Row alignItems="center">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={13}
            color={COLORS.smokyBlack}
          >
            {item.name || StringUtils.formatAddress(item.address, 4, 4)}
          </Text>
          {indicatorVisible && (
            <>
              <Spacer value={scale(13)} horizontal />
              <AddressIndicator address={item.address} />
            </>
          )}
        </Row>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
        >
          $
          {usdBalance >= 100
            ? NumberUtils.formatNumber(usdBalance, 0)
            : NumberUtils.formatNumber(usdBalance, 2)}
        </Text>
      </Row>
      <Spacer value={5} />
      <Row justifyContent="space-between">
        <Text fontFamily="Inter_500Medium" color="#0e0e0e80" fontSize={12}>
          {NumberUtils.formatNumber(item.ambBalance, 0)} AMB
        </Text>
        <Row alignItems="center">
          <PercentChange change={ambTokenData?.percentChange24H || 0} />
        </Row>
      </Row>
    </View>
  );
}

export const WalletItem = React.memo(WalletItemView);
