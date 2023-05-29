import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { NumberUtils } from '@utils/number';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks';
import { PercentChange } from '@components/composite';
import { COLORS } from '@constants/colors';
import { useLists } from '@contexts';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

interface WalletItemProps {
  item: ExplorerAccount;
}

export function WalletItem(props: WalletItemProps): JSX.Element {
  const { data } = useAMBPrice();
  const { item } = props;
  const { data: ambTokenData } = useAMBPrice();
  const { listsOfAddressGroup } = useLists((v) => v);
  const listWithWallet = listsOfAddressGroup.find(
    (list) =>
      list.accounts?.findIndex((account) => account?._id === item?._id) > -1
  );

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
          {listWithWallet && (
            <>
              <Spacer value={scale(13)} horizontal />
              <View
                style={{
                  backgroundColor: COLORS.smokyBlack5,
                  paddingVertical: verticalScale(4),
                  paddingHorizontal: scale(8),
                  borderRadius: moderateScale(20)
                }}
              >
                <Text
                  fontSize={12}
                  fontFamily="Inter_500Medium"
                  color={COLORS.graphiteGrey}
                >
                  {listWithWallet.name}
                </Text>
              </View>
            </>
          )}
        </Row>
        <Text
          fontFamily="Mersad_600SemiBold"
          fontSize={13}
          color={COLORS.smokyBlack}
        >
          $
          {NumberUtils.formatNumber(
            item.ambBalance * (ambTokenData?.priceUSD || 0),
            0
          )}
        </Text>
      </Row>
      <Spacer value={5} />
      <Row justifyContent="space-between">
        <Text fontFamily="Mersad_600SemiBold" color="#0e0e0e80" fontSize={13}>
          {NumberUtils.formatNumber(item.ambBalance, 0)} AMB
        </Text>
        <Row alignItems="center">
          <PercentChange change={data?.percentChange24H || 0} />
        </Row>
      </Row>
    </View>
  );
}
