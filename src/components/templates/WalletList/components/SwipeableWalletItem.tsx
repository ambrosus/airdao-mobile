import React, { forwardRef, memo, useCallback, useRef } from 'react';
import { DeviceEventEmitter, Dimensions, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { WalletItem } from '@components/templates/WalletItem';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { BottomSheetRemoveAddressFromCollection } from '@components/templates/BottomSheetRemoveAddressFromCollection';
import { COLORS } from '@constants/colors';
import { SwipeAction } from './SwipeAction';
import { useSwipeableDismissListener } from '@hooks';
import { EVENTS } from '@constants/events';

export type SwipeableWalletItemProps = {
  item: ExplorerAccount;
  idx: number;
  isPortfolioFlow?: boolean;
  removeType?: 'watchlist' | 'collection';
};

const screenWidth = Dimensions.get('screen').width;

export const SwipeableWalletItem = memo(
  forwardRef<Swipeable, SwipeableWalletItemProps>(
    (
      { item, idx, isPortfolioFlow = false, removeType = 'watchlist' },
      previousRef
    ) => {
      const editModalRef = useRef<BottomSheetRef>(null);
      const swipeRef = useRef<Swipeable>(null);
      const confirmRemoveRef = useRef<BottomSheetRef>(null);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      const navigation = useNavigation<WalletsNavigationProp>();

      const paddingRightAnimation = useSharedValue(0);
      // close swipeable on another swipeable open
      useSwipeableDismissListener('wallet-item-opened', item._id, swipeRef);

      const handleConfirmRemove = useCallback(() => {
        swipeRef.current?.close();
        confirmRemoveRef.current?.show();
      }, []);

      const navigateToAddressDetails = useCallback(() => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          navigation.navigate('Address', { address: item.address });
        }, 200);
      }, [item.address, navigation, timeoutRef]);

      const stylesForPortfolio = isPortfolioFlow
        ? {
            paddingVertical: 16,
            borderColor: COLORS.charcoal,
            borderBottomWidth: 1,
            borderTopWidth: idx === 0 ? 1 : 0
          }
        : {};

      const showEdit = useCallback(() => {
        editModalRef.current?.show();
        swipeRef.current?.close();
      }, []);

      const handleSwipeableWillOpen = useCallback(() => {
        DeviceEventEmitter.emit(EVENTS.WalletItemOpened, item._id);
        clearTimeout(timeoutRef.current ?? undefined);
        if (
          previousRef &&
          typeof previousRef !== 'function' &&
          previousRef.current !== null
        ) {
          if (previousRef.current !== swipeRef.current) {
            previousRef.current?.close();
          }
        }
        paddingRightAnimation.value = withTiming(16, { duration: 200 });
      }, [item._id, paddingRightAnimation, previousRef]);

      const handleSwipeableWillClose = useCallback(() => {
        paddingRightAnimation.value = withTiming(0, { duration: 200 });
      }, [paddingRightAnimation]);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          paddingRight: paddingRightAnimation.value
        };
      });

      return (
        <Swipeable
          enabled={isPortfolioFlow}
          renderRightActions={(_, dragX) => (
            <SwipeAction
              dragX={dragX}
              showEdit={showEdit}
              handleConfirmRemove={handleConfirmRemove}
            />
          )}
          ref={swipeRef}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          onSwipeableWillClose={handleSwipeableWillClose}
          rightThreshold={0}
          hitSlop={{ left: -(screenWidth * 0.5), right: 0 }}
        >
          <Pressable onPress={navigateToAddressDetails}>
            <Animated.View
              style={[{ ...styles.item }, stylesForPortfolio, animatedStyle]}
            >
              <WalletItem item={item} indicatorVisible={true} />
            </Animated.View>
          </Pressable>
          <BottomSheetEditWallet wallet={item} ref={editModalRef} />
          {removeType === 'watchlist' && (
            <BottomSheetRemoveAddressFromWatchlists
              key={item.address}
              item={item}
              ref={confirmRemoveRef}
            />
          )}
          {removeType === 'collection' && (
            <BottomSheetRemoveAddressFromCollection
              key={item.address}
              wallet={item}
              ref={confirmRemoveRef}
            />
          )}
        </Swipeable>
      );
    }
  )
);
