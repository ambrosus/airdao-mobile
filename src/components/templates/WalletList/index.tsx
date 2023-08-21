import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, ScrollViewProps } from 'react-native';
import Animated, { SlideInDown, SlideOutRight } from 'react-native-reanimated';
import { verticalScale } from '@utils/scaling';
import { ExplorerAccount } from '@models/Explorer';
import {
  SwipeableWalletItemProps,
  SwipeableWalletItem
} from '@components/templates/WalletList/components/SwipeableWalletItem';
import { LocalizedRenderEmpty } from '@components/templates';

interface EmptyWalletListProps {
  emptyText: string;
}

interface WalletListProps
  extends EmptyWalletListProps,
    Pick<SwipeableWalletItemProps, 'removeType'> {
  data: ExplorerAccount[];
  isPortfolioFlow?: boolean;
  scrollEnabled?: boolean; // default to true
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  renderItem?: (
    args: ListRenderItemInfo<ExplorerAccount>
  ) => React.ReactElement;
  onRefresh?: () => void;
}

export function WalletList(props: WalletListProps): JSX.Element {
  const {
    data,
    isPortfolioFlow = false,
    scrollEnabled = true,
    removeType = 'watchlist',
    contentContainerStyle = {},
    renderItem,
    onRefresh
  } = props;

  const renderWallet = useCallback(
    (args: ListRenderItemInfo<ExplorerAccount>) => {
      if (typeof renderItem === 'function') return renderItem(args);
      return (
        <Animated.View
          key={args.item.address}
          exiting={SlideOutRight}
          entering={SlideInDown}
        >
          <SwipeableWalletItem
            item={args.item}
            idx={args.index}
            isPortfolioFlow={isPortfolioFlow}
            removeType={removeType}
          />
        </Animated.View>
      );
    },
    [isPortfolioFlow, removeType, renderItem]
  );

  return (
    <FlatList
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingTop: verticalScale(16)
        },
        contentContainerStyle
      ]}
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={renderWallet}
      ListEmptyComponent={<LocalizedRenderEmpty text={'no.addresses.yet'} />}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={false} // TODO
    />
  );
}
