import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollViewProps,
  View
} from 'react-native';
import Animated, { SlideInDown, SlideOutRight } from 'react-native-reanimated';
import { WatchlistTabIcon } from '@components/svg/BottomTabIcons';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { ExplorerAccount } from '@models/Explorer';
import {
  SwipeableWalletItem,
  SwipeableWalletItemProps
} from './components/SwipeableWalletItem';
import { LocalizedRenderEmpty } from '../LocalizedRenderEmpty';

interface EmptyAddressListProps {
  emptyText: string;
}

interface AddressListProps
  extends EmptyAddressListProps,
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

export function AddressList(props: AddressListProps): JSX.Element {
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
          flexGrow: 1
        },
        contentContainerStyle
      ]}
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={renderWallet}
      ListEmptyComponent={
        <View style={{ paddingTop: verticalScale(234) }}>
          <LocalizedRenderEmpty
            text={'empty.addresses'}
            icon={<WatchlistTabIcon color={COLORS.neutral300} scale={1.7} />}
          />
        </View>
      }
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={false} // TODO
    />
  );
}
