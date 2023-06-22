import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { verticalScale } from '@utils/scaling';
import { ExplorerAccount } from '@models/Explorer';
import {
  SwipeableWalletItemProps,
  SwipeableWalletItem
} from '@components/templates/WalletList/components/SwipeableWalletItem';
import { RenderEmpty } from '@components/templates/RenderEmpty';
import Animated, { SlideOutRight } from 'react-native-reanimated';

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
    isPortfolioFlow = false,
    scrollEnabled = true,
    renderItem,
    removeType = 'watchlist'
  } = props;

  const renderWallet = (args: ListRenderItemInfo<ExplorerAccount>) => {
    if (typeof renderItem === 'function') return renderItem(args);
    return (
      <Animated.View key={args.item.address} exiting={SlideOutRight}>
        <SwipeableWalletItem
          item={args.item}
          idx={args.index}
          isPortfolioFlow={isPortfolioFlow}
          removeType={removeType}
        />
      </Animated.View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: verticalScale(16)
        // paddingBottom: '25%'
      }}
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={renderWallet}
      ListEmptyComponent={<RenderEmpty text="addresses" />}
      showsVerticalScrollIndicator={false}
    />
  );
}
