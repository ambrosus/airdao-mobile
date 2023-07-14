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
    <View style={{ justifyContent: 'space-between' }} testID="Wallet_Item_View">
      <Row justifyContent="space-between" testID="wallet-item-row1">
        <Row alignItems="center" testID="Wallet_Item_Row1_Inner">
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={13}
            color={COLORS.smokyBlack}
            testID="Wallet_Item_Name"
          >
            {StringUtils.formatAddress(item.name, 4, 4) ||
              StringUtils.formatAddress(item.address, 4, 4)}
          </Text>
          {indicatorVisible && (
            <>
              <Spacer value={scale(13)} horizontal />
              <AddressIndicator
                address={item.address}
                testID="Wallet_Item_Address_Indicator"
              />
            </>
          )}
        </Row>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
          testID="Wallet_Item_Balance"
        >
          $
          {usdBalance >= 100
            ? NumberUtils.formatNumber(usdBalance, 0)
            : NumberUtils.formatNumber(usdBalance, 2)}
        </Text>
      </Row>
      <Spacer value={5} />
      <Row justifyContent="space-between" testID="Wallet_Item_Row2">
        <Text
          fontFamily="Inter_500Medium"
          color="#0e0e0e80"
          fontSize={12}
          testID="Wallet_Item_AMB"
        >
          {NumberUtils.formatNumber(item.ambBalance, 0)} AMB
        </Text>
        <Row alignItems="center" testID="Wallet_Item_Percent_Change">
          <PercentChange change={ambTokenData?.percentChange24H || 0} />
        </Row>
      </Row>
    </View>
  );
}

export const WalletItem = React.memo(WalletItemView);
