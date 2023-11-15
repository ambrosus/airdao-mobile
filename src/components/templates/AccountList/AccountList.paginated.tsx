import React, { useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { SCREEN_WIDTH, scale } from '@utils/scaling';
import { AccountListProps } from './AccountList.types';
import { AccountList } from './AccountList';

interface PaginatedAccountListProps extends AccountListProps {
  listProps?: AccountListProps['listProps'];
  onScrolIndexChange?: (newPosition: number) => void;
}
const PAGE_WIDTH = SCREEN_WIDTH - scale(36) * 2; // card width

export const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const { accounts, listProps, type, onScrolIndexChange } = props;
  const cardList = useRef<FlatList>(null);
  const scrollPos = useRef(0);
  const currentIdx = useRef(0);

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x;
    const offset = Math.abs(xPos - scrollPos.current);
    if (offset < scale(200)) {
      // the scroll offset is not enough to change selected card
      scrollToItem(currentIdx.current);
      return;
    }
    if (xPos > scrollPos.current) {
      // move next item
      scrollToItem(currentIdx.current + 1);
    } else {
      // move to previous item
      scrollToItem(currentIdx.current - 1);
    }
  };

  const scrollToItem = (idx: number) => {
    const calculateOffsetForIndex = (idx: number) => {
      // 14 is chosen arbitrarily to make UI look good
      return PAGE_WIDTH * idx + scale(14) * (idx - 2);
    };
    scrollPos.current = calculateOffsetForIndex(idx);
    cardList.current?.scrollToOffset({
      animated: true,
      offset: scrollPos.current
    });
    currentIdx.current = idx;
    if (typeof onScrolIndexChange === 'function') onScrolIndexChange(idx);
  };

  return (
    <AccountList
      ref={cardList}
      onPressAccount={(_, idx) => scrollToItem(idx)}
      accounts={accounts}
      horizontal={true}
      type={type}
      listProps={{
        decelerationRate: 'fast',
        onScrollEndDrag,
        ...listProps
      }}
    />
  );
};
