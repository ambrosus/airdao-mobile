import React, { useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { scale } from '@utils/scaling';
import { AccountListProps } from './AccountList.types';
import { AccountList } from './AccountList';
import { AccountDBModel } from '@database';

interface PaginatedAccountListProps extends AccountListProps {
  listProps?: AccountListProps['listProps'];
  onScrolIndexChange?: (newPosition: number) => void;
}
const PAGE_WIDTH = scale(300); // card width

export const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const { accounts, listProps, onScrolIndexChange } = props;
  const cardList = useRef<FlatList>(null);
  const scrollPos = useRef(0);

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x;
    let newScrollPos = 0;
    if (xPos >= scrollPos.current) {
      if (xPos - scrollPos.current >= scale(200)) {
        // limit 'to-right' scroll by list width
        newScrollPos = Math.min(
          accounts.length * PAGE_WIDTH,
          scrollPos.current + PAGE_WIDTH
        );
      } else {
        newScrollPos = scrollPos.current;
      }
    } else {
      if (scrollPos.current - xPos >= scale(200)) {
        // limit 'to-left' scroll by 0
        newScrollPos = Math.max(0, scrollPos.current - PAGE_WIDTH);
      } else {
        newScrollPos = scrollPos.current;
      }
    }
    cardList.current?.scrollToOffset({
      animated: true,
      offset: newScrollPos
    });
    scrollPos.current = newScrollPos;
    const scrollIdx = Math.floor(scrollPos.current / PAGE_WIDTH);
    if (typeof onScrolIndexChange === 'function') onScrolIndexChange(scrollIdx);
  };

  const scrollToItem = (account: AccountDBModel, idx: number) => {
    const calculateOffsetForIndex = (idx: number) => {
      return PAGE_WIDTH * idx;
    };
    scrollPos.current = calculateOffsetForIndex(idx);
    cardList.current?.scrollToOffset({
      animated: true,
      offset: scrollPos.current
    });
    if (typeof onScrolIndexChange === 'function') onScrolIndexChange(idx);
  };

  return (
    <AccountList
      ref={cardList}
      onPressAccount={scrollToItem}
      accounts={accounts}
      horizontal={true}
      type="credit-card"
      listProps={{
        decelerationRate: 'fast',
        onScrollEndDrag,
        ...listProps
      }}
    />
  );
};
