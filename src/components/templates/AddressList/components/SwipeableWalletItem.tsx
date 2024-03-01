import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { WalletItem } from '@components/templates/WalletItem';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, HomeNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { styles } from '@components/templates/AddressList/styles';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetRemoveAddressFromWatchlists';
import { BottomSheetRemoveAddressFromCollection } from '@components/templates/BottomSheetRemoveAddressFromCollection';
import { COLORS } from '@constants/colors';
import { useSwipeableDismissListener } from '@hooks';
import { AirDAOEventDispatcher } from '@lib';
import { SwipeAction } from './SwipeAction';

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
      const [open, setOpen] = useState<boolean>(false);

      const navigation = useNavigation<HomeNavigationProp>();

      const paddingRightAnimation = useSharedValue(0);
      // close swipeable on another swipeable open
      useSwipeableDismissListener(
        AirDAOEventType.WalletItemOpened,
        item._id,
        swipeRef
      );

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
            borderColor: COLORS.alphaBlack5,
            borderBottomWidth: 1,
            borderTopWidth: idx === 0 ? 1 : 0
          }
        : {};

      const showEdit = useCallback(() => {
        editModalRef.current?.show();
        swipeRef.current?.close();
      }, []);

      const handleSwipeableWillOpen = useCallback(() => {
        AirDAOEventDispatcher.dispatch(
          AirDAOEventType.WalletItemOpened,
          item._id
        );
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
        setOpen(true);
        paddingRightAnimation.value = withTiming(16, { duration: 200 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [item._id, paddingRightAnimation, previousRef, open]);

      const handleSwipeableWillClose = useCallback(() => {
        setOpen(false);
        paddingRightAnimation.value = withTiming(0, { duration: 200 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [paddingRightAnimation, open]);

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
          hitSlop={
            open
              ? {
                  right: -(screenWidth * 0.35),
                  left: 0,
                  top: 0,
                  bottom: 0
                }
              : {
                  right: 0,
                  left: -(screenWidth * 0.65),
                  top: 0,
                  bottom: 0
                }
          }
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
