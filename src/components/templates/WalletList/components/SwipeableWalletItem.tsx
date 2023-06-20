import React, { forwardRef, memo, useCallback, useRef } from 'react';
import { COLORS } from '@constants/colors';
import { Animated, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { WalletItem } from '@components/templates/WalletItem';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { BottomSheetRemoveAddressFromCollection } from '@components/templates/BottomSheetRemoveAddressFromCollection';
import { SwipeAction } from './SwipeAction';

export type SwipeableWalletItemProps = {
  item: ExplorerAccount;
  idx: number;
  isPortfolioFlow?: boolean;
  removeType?: 'watchlist' | 'collection';
};

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

      const paddingRightAnim = useRef(new Animated.Value(0)).current;

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
        Animated.timing(paddingRightAnim, {
          toValue: 16,
          duration: 200,
          useNativeDriver: false
        }).start();
      }, [paddingRightAnim, previousRef]);

      const handleSwipeableWillClose = useCallback(() => {
        Animated.timing(paddingRightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start();
      }, [paddingRightAnim]);

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
        >
          <Pressable onPress={navigateToAddressDetails}>
            <Animated.View
              style={[
                { ...styles.item },
                stylesForPortfolio,
                { paddingRight: paddingRightAnim }
              ]}
            >
              <WalletItem item={item} />
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
