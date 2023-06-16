import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { COLORS } from '@constants/colors';
import { Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { WalletItem } from '@components/templates/WalletItem';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { SwipeAction } from '@components/templates/WalletList/components/SwipeAction';

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

      const [swipeState, setSwipeState] = useState<boolean>(false);

      const navigation = useNavigation<WalletsNavigationProp>();

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

      const handleSwipeableOpen = useCallback(() => {
        clearTimeout(timeoutRef.current ?? undefined);
        if (previousRef && typeof previousRef !== 'function') {
          previousRef.current = swipeRef.current;
        }
        setSwipeState(true);
      }, [previousRef, timeoutRef]);

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
        setSwipeState(true);
      }, [previousRef, timeoutRef]);

      const handleSwipeableWillClose = useCallback(() => {
        setSwipeState(false);
      }, []);

      return (
        <Swipeable
          enabled={isPortfolioFlow}
          renderRightActions={(_, dragX) => (
            <SwipeAction
              dragX={dragX}
              item={item}
              showEdit={showEdit}
              confirmRemoveRef={confirmRemoveRef}
              handleConfirmRemove={handleConfirmRemove}
              removeType={removeType}
            />
          )}
          ref={swipeRef}
          onSwipeableOpen={handleSwipeableOpen}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          onSwipeableWillClose={handleSwipeableWillClose}
        >
          <Pressable
            style={[
              { ...styles.item },
              stylesForPortfolio,
              swipeState && { paddingRight: 16 }
            ]}
            onPress={navigateToAddressDetails}
          >
            <WalletItem item={item} />
          </Pressable>
          <BottomSheetEditWallet wallet={item} ref={editModalRef} />
        </Swipeable>
      );
    }
  )
);
