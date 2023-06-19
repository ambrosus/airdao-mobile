import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { Animated, Pressable } from 'react-native';
import { Button, Spacer } from '@components/base';
import { EditIcon, TrashIcon } from '@components/svg/icons';
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

      const SwipeAction: React.FC<SwipeActionsProps> = ({ dragX, onPress }) => {
        const trans = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [0, 20],
          extrapolate: 'clamp'
        });

        return (
          <>
            <Pressable style={styles.rightActions} onPress={onPress}>
              <Animated.View
                style={[
                  styles.rightActions,
                  { backgroundColor: 'transparent' },
                  { transform: [{ translateX: trans }] }
                ]}
              >
                <Button onPress={showEdit}>
                  <EditIcon scale={1.5} color={COLORS.deepBlue} />
                </Button>
                <Spacer horizontal value={scale(52)} />
                <Button onPress={handleConfirmRemove}>
                  <TrashIcon color={COLORS.lightPink} />
                </Button>
              </Animated.View>
            </Pressable>
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
          </>
        );
      };

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
