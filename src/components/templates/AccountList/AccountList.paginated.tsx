import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { scale } from '@utils';
import { AccountList } from './AccountList';
import { AccountListProps } from './AccountList.types';

interface PaginatedAccountListProps extends AccountListProps {
  listProps?: AccountListProps['listProps'];
  onScrollIndexChange?: (newPosition: number) => void;
}
const SCROLL_OFFSET_LIMIT = scale(200);
const SCROLL_SPEED_LIMIT = 40;

export const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const { accounts, listProps, type, onScrollIndexChange } = props;
  const cardList = useRef<FlatList>(null);
  const scrollPos = useRef(0);
  const currentIdx = useRef(0);
  const scrollBegin = useRef(0);
  const scrollBeginAt = useRef(0);

  const onScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // save X position and time of start of scroll
      scrollBegin.current = event.nativeEvent.contentOffset.x;
      scrollBeginAt.current = new Date().getTime();
    },
    []
  );

  const resetScrollBeginInfo = () => {
    scrollBegin.current = 0;
    scrollBeginAt.current = 0;
  };

  const scrollToItem = useCallback(
    (idx: number) => {
      if (!(idx >= 0 && idx < accounts.length)) return;
      cardList.current?.scrollToIndex({
        index: idx,
        animated: true,
        viewOffset: scale(20)
      });
      currentIdx.current = idx;
      setTimeout(() => {
        if (typeof onScrollIndexChange === 'function') onScrollIndexChange(idx);
      });
    },
    [accounts.length, onScrollIndexChange]
  );

  const onScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const xPos = event.nativeEvent.contentOffset.x;
      const offset = Math.abs(xPos - scrollPos.current);
      // calculate speed of scroll by speed = distance / time
      const speed =
        (xPos - scrollBegin.current) /
        (new Date().getTime() / scrollBeginAt.current);
      if (
        offset < SCROLL_OFFSET_LIMIT &&
        Math.abs(speed) < SCROLL_SPEED_LIMIT
      ) {
        // the scroll offset is not enough to change selected card
        scrollToItem(currentIdx.current);
        // reset scroll begin info
        return resetScrollBeginInfo();
      }

      if (
        xPos > scrollPos.current ||
        (Math.abs(speed) > SCROLL_SPEED_LIMIT && speed > 0)
      ) {
        // move next item
        scrollToItem(currentIdx.current + 1);
      } else {
        // move to previous item
        scrollToItem(currentIdx.current - 1);
      }
    },
    [scrollToItem]
  );

  return (
    <AccountList
      ref={cardList}
      onPressAccount={(_, idx) => scrollToItem(idx)}
      accounts={accounts}
      horizontal={true}
      type={type}
      listProps={{
        decelerationRate: 'fast',
        onScrollBeginDrag,
        onScrollEndDrag,
        onMomentumScrollEnd: (event) => {
          scrollPos.current = event.nativeEvent.contentOffset.x;
        },
        ...listProps
      }}
    />
  );
};
