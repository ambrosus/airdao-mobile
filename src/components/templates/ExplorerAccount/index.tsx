import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { ExplorerAccount } from '@models/Explorer';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useAMBPrice } from '@hooks/query';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { useWatchlist } from '@hooks/cache';

interface ExplorerAccountProps {
  account: ExplorerAccount;
  totalSupply: number;
}

export const ExplorerAccountView = (
  props: ExplorerAccountProps
): JSX.Element => {
  const { account, totalSupply } = props;
  const { address } = account;
  const { watchlist } = useWatchlist();
  const walletInWatchlist = watchlist.find(
    (w) => w.addressId === account.address
  );
  const { data } = useAMBPrice();
  const ambPriceUSD = data?.priceUSD || 0;

  const AMBBalance = account.ambBalance;
  const USDBalance = AMBBalance * ambPriceUSD;
  const percentage = (AMBBalance / totalSupply) * 100;

  return (
    <View style={styles.container}>
      {walletInWatchlist && (
        <>
          <Row alignItems="center">
            <Text fontFamily="Inter_600SemiBold" fontSize={15}>
              {walletInWatchlist.addressTitle}
            </Text>
            <Spacer value={scale(12)} horizontal />
            <Text
              color="#828282"
              fontFamily="Inter_400Regular"
              fontSize={13}
              fontWeight="400"
            >
              Added to Watchlists
            </Text>
          </Row>
          <Spacer value={verticalScale(13)} />
        </>
      )}
      <Text fontSize={15} fontFamily="Inter_600SemiBold">
        {StringUtils.formatAddress(address, 11, 5)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontFamily="Mersad_600SemiBold" fontSize={36}>
        ${NumberUtils.formatNumber(USDBalance)}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={12} fontWeight="500">
        {NumberUtils.formatNumber(AMBBalance, 2)} AMB
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text fontSize={11} fontWeight="400">
        Holding {NumberUtils.formatNumber(percentage, 2)}% Supply
      </Text>
    </View>
  );
};
