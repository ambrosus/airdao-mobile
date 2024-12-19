import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { Dimensions, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { AirDAOEventType } from '@appTypes';
import { PortfolioNavigationProp } from '@appTypes/navigation';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { CollectionItem } from '@components/modular';
import { SwipeAction } from '@components/templates/AddressList/components/SwipeAction';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { useListActions } from '@features/lists';
import { useSwipeableDismissListener } from '@hooks';
import { AirDAOEventDispatcher } from '@lib';
import { AccountList } from '@models/AccountList';
import { BottomSheetConfirmRemoveGroup } from '@screens/Settings/screens/Watchlist/components/BottomSheetConfirmRemoveGroup';
import { styles } from './styles';

type Props = {
  group: AccountList;
  isFirstItem: boolean;
  wrapperStyles?: ViewStyle;
  swipeable?: boolean;
};

const screenWidth = Dimensions.get('screen').width;

export const GroupItem = memo(
  forwardRef<Swipeable, Props>(
    ({ group, isFirstItem, wrapperStyles, swipeable }, previousRef) => {
      const navigation = useNavigation<PortfolioNavigationProp>();
      const { onDeleteList, onRenameList } = useListActions();

      const paddingRightAnimation = useSharedValue(0);

      const groupRenameRef = useRef<BottomSheetRef>(null);
      const groupDeleteRef = useRef<BottomSheetRef>(null);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);
      const swipeableRef = useRef<Swipeable>(null);

      const [open, setOpen] = useState<boolean>(false);
      // close swipeable on another swipeable open
      useSwipeableDismissListener(
        AirDAOEventType.CollectionItemOpened,
        group.id,
        swipeableRef
      );

      const handleOpenRenameModal = useCallback(() => {
        groupRenameRef.current?.show();
        swipeableRef.current?.close();
      }, []);

      const handleItemPress = useCallback(() => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          navigation.navigate('Collection', { group });
        }, 200);
      }, [group, navigation, timeoutRef]);

      const handleRemoveConfirm = (groupId: string) => {
        onDeleteList(groupId).then();
        groupDeleteRef.current?.dismiss();
      };

      const handleConfirmRemove = useCallback(() => {
        groupDeleteRef.current?.show();
        swipeableRef.current?.close();
      }, []);

      const handleSwipeableWillOpen = useCallback(() => {
        AirDAOEventDispatcher.dispatch(
          AirDAOEventType.CollectionItemOpened,
          group.id
        );
        clearTimeout(timeoutRef.current ?? undefined);
        if (
          previousRef &&
          typeof previousRef !== 'function' &&
          previousRef.current !== null
        ) {
          if (previousRef.current !== swipeableRef.current) {
            previousRef.current?.close();
          }
        }
        setOpen(true);
        paddingRightAnimation.value = withTiming(16, { duration: 200 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [group.id, paddingRightAnimation, previousRef, open]);

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

      const stylesForFirstItem = useMemo(() => {
        return {};
      }, []);

      const containerStyles = useMemo(() => {
        return isFirstItem
          ? { ...styles.container, ...stylesForFirstItem, ...wrapperStyles }
          : { ...styles.container, ...wrapperStyles };
      }, [isFirstItem, stylesForFirstItem, wrapperStyles]);

      return (
        <Swipeable
          enabled={swipeable}
          renderRightActions={(_, dragX) => (
            <SwipeAction
              dragX={dragX}
              showEdit={handleOpenRenameModal}
              handleConfirmRemove={handleConfirmRemove}
            />
          )}
          ref={swipeableRef}
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
          <Pressable onPress={handleItemPress} style={containerStyles}>
            <Animated.View style={[{ ...styles.item }, animatedStyle]}>
              <CollectionItem collection={group} />
            </Animated.View>
          </Pressable>
          <BottomSheetConfirmRemoveGroup
            handleOnDeleteConfirm={handleRemoveConfirm}
            item={group}
            groupId={group.id}
            ref={groupDeleteRef}
          />
          <BottomSheetCreateRenameGroup
            type="rename"
            groupId={group.id}
            groupTitle={group.name}
            handleOnRenameGroup={onRenameList}
            ref={groupRenameRef}
          />
        </Swipeable>
      );
    }
  )
);
