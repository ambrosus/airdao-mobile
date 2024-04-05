import { Row, Spacer, Text } from '@components/base';
import React from 'react';
import { View } from 'react-native';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useLists } from '@contexts';
import { useWatchlist } from '@hooks';
import { AddressIndicator } from '@components/templates';
import { useTranslation } from 'react-i18next';

interface ExplorerWalletItemProps {
  item: ExplorerAccount;
  totalSupply: number;
  indicatorVisible?: boolean; // show info whether address is watchlisted or added to collection
}

export const ExplorerWalletItem = (
  props: ExplorerWalletItemProps
): JSX.Element => {
  const { item, totalSupply, indicatorVisible } = props;
  const { address, transactionCount, ambBalance } = item;
  const { listsOfAddressGroup } = useLists((v) => v);
  const { watchlist } = useWatchlist();
  const { t } = useTranslation();
  const listWithAddress = listsOfAddressGroup.filter(
    (list) => list.accounts?.indexOfItem(item, 'address') > -1
  );
  const isWatchlisted = watchlist.indexOfItem(item, 'address') > -1;

  const leftPadding = indicatorVisible
    ? listWithAddress.length > 0 || isWatchlisted
      ? 4
      : 7
    : 7;
  const rightPadding = indicatorVisible
    ? listWithAddress.length > 0 || isWatchlisted
      ? 4
      : 9
    : 9;

  return (
    <View>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <Text
            fontSize={14}
            style={{ width: isWatchlisted ? 90 : 'auto' }}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {StringUtils.formatAddress(address, leftPadding, rightPadding)}
          </Text>
          {indicatorVisible && <AddressIndicator address={item.address} />}
        </Row>
        <Text
          fontSize={13}
          fontFamily="Mersad_600SemiBold"
          color={COLORS.neutral900}
        >
          {NumberUtils.formatNumber(ambBalance, 0)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(5)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={12}
          color={COLORS.alphaBlack50}
          fontFamily="Inter_500Medium"
        >
          {t('explore.single.address.holding', {
            share: NumberUtils.formatNumber(
              // item.calculatePercentHoldings(totalSupply),
              (item.ambBalance / totalSupply) * 100,
              2
            )
          })}
        </Text>
        <Text
          fontSize={13}
          fontFamily="Inter_500Medium"
          color={COLORS.alphaBlack50}
        >
          {transactionCount}{' '}
          {t('common.transaction', { count: transactionCount })}
        </Text>
      </Row>
    </View>
  );
};
