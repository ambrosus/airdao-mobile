import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Pressable,
  ViewStyle
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useNavigation } from '@react-navigation/native';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { AccountList } from '@models/AccountList';
import { BottomSheetConfirmRemoveGroup } from '@screens/Portfolio/components/BottomSheetConfirmRemoveGroup';
import { PortfolioNavigationProp } from '@appTypes/navigation';
import { SwipeAction } from '@components/templates/WalletList/components/SwipeAction';
import { CollectionItem } from '@components/modular';
import { styles } from './styles';
import { useSwipeableDismissListener } from '@hooks';

type Props = {
  group: AccountList;
  isFirstItem: boolean;
  wrapperStyles?: ViewStyle;
  swipeable?: boolean;
};
export const GroupItem = memo(
  forwardRef<Swipeable, Props>(
    ({ group, isFirstItem, wrapperStyles, swipeable }, previousRef) => {
      const { handleOnDelete, handleOnRename } = useLists((v) => v);
      const groupRenameRef = useRef<BottomSheetRef>(null);
      const groupDeleteRef = useRef<BottomSheetRef>(null);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);
      const swipeableRef = useRef<Swipeable>(null);
      const navigation = useNavigation<PortfolioNavigationProp>();

      // close swipeable on another swipeable open
      useSwipeableDismissListener(
        'collection-item-opened',
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
        handleOnDelete(groupId);
        groupDeleteRef.current?.dismiss();
      };

      const handleConfirmRemove = useCallback(() => {
        groupDeleteRef.current?.show();
        swipeableRef.current?.close();
      }, []);

      const paddingRightAnim = useRef(new Animated.Value(0)).current;

      const handleSwipeableWillOpen = useCallback(() => {
        DeviceEventEmitter.emit('collection-item-opened', group.id);
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
        Animated.timing(paddingRightAnim, {
          toValue: 16,
          duration: 200,
          useNativeDriver: false
        }).start();
      }, [group.id, paddingRightAnim, previousRef]);

      const handleSwipeableWillClose = useCallback(() => {
        Animated.timing(paddingRightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start();
      }, [paddingRightAnim]);

      const stylesForFirstItem = useMemo(() => {
        return {
          borderTopWidth: 1
        };
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
        >
          <Pressable onPress={handleItemPress} style={containerStyles}>
            <Animated.View
              style={[{ ...styles.item }, { paddingRight: paddingRightAnim }]}
            >
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
            handleOnRenameGroup={handleOnRename}
            ref={groupRenameRef}
          />
        </Swipeable>
      );
    }
  )
);
