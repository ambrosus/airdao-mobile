import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { AddressIndicator } from '@components/templates';
import { COLORS } from '@constants/colors';
import { useListsSelector } from '@entities/lists';
import { useWatchlist } from '@hooks';
import { ExplorerAccount } from '@models/Explorer';
import { verticalScale, StringUtils, NumberUtils } from '@utils';

interface ExplorerWalletItemProps {
  item: ExplorerAccount;
  totalSupply: number;
  indicatorVisible?: boolean; // show info whether address is watchlisted or added to collection
}

export const ExplorerWalletItem = ({
  item,
  totalSupply,
  indicatorVisible
}: ExplorerWalletItemProps): JSX.Element => {
  const { t } = useTranslation();
  const { listsOfAddressGroup } = useListsSelector();
  const { watchlist } = useWatchlist();

  const { address, transactionCount, ambBalance } = item;

  const listWithAddress = useMemo(
    () =>
      listsOfAddressGroup.filter(
        (list) => list.accounts?.indexOfItem(item, 'address') > -1
      ),
    [item, listsOfAddressGroup]
  );

  const isWatchlisted = watchlist.indexOfItem(item, 'address') > -1;
  const isShowHoldPercentage = !!item.ambBalance && !!totalSupply;
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
          // style={{ lineHeight: 18 }}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral900}
        >
          {NumberUtils.formatNumber(ambBalance, 0)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(5)} />
      <Row alignItems="center" justifyContent="space-between">
        {isShowHoldPercentage && (
          <Text
            fontSize={12}
            color={COLORS.alphaBlack50}
            fontFamily="Inter_500Medium"
          >
            {t('explore.single.address.holding', {
              share: NumberUtils.formatNumber(
                (item.ambBalance / totalSupply) * 100,
                2
              )
            })}
          </Text>
        )}
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
