import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { EmptyWalletListPlaceholderIcon } from '@components/svg/icons';
import { ExplorerAccount } from '@models/Explorer';
import {
  SwipeableWalletItemProps,
  SwipeableWalletItem
} from '@components/templates/WalletList/components/RenderItem';
import { styles } from '@components/templates/WalletList/styles';

interface EmptyWalletListProps {
  emptyText: string;
}

interface WalletListProps
  extends EmptyWalletListProps,
    Pick<SwipeableWalletItemProps, 'removeType'> {
  data: ExplorerAccount[];
  isPortfolioFlow?: boolean;
  scrollEnabled?: boolean; // default to true
  renderItem?: (
    args: ListRenderItemInfo<ExplorerAccount>
  ) => React.ReactElement;
}

export function WalletList(props: WalletListProps): JSX.Element {
  const {
    data,
    emptyText,
    isPortfolioFlow = false,
    scrollEnabled = true,
    renderItem,
    removeType = 'watchlist'
  } = props;

  const renderEmpty = () => {
    return (
      <View testID="empty-list" style={styles.emptyContainer}>
        <EmptyWalletListPlaceholderIcon />
        <Spacer value={verticalScale(16)} />
        <Text
          color="#51545A"
          fontWeight="400"
          fontSize={15}
          align="center"
          fontFamily="Inter_400Regular"
        >
          {emptyText}
        </Text>
        <Text fontFamily="Inter_400Regular" fontSize={15} color="#51545a">
          No addresses yet
        </Text>
      </View>
    );
  };

  const renderWallet = (args: ListRenderItemInfo<ExplorerAccount>) => {
    if (typeof renderItem === 'function') return renderItem(args);
    return (
      <View key={args.item.address}>
        <SwipeableWalletItem
          item={args.item}
          idx={args.index}
          isPortfolioFlow={isPortfolioFlow}
          removeType={removeType}
        />
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: verticalScale(16),
        paddingBottom: '25%'
      }}
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={renderWallet}
      ListEmptyComponent={renderEmpty()}
      showsVerticalScrollIndicator={false}
    />
  );
}
