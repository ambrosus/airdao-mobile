import React, { useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { scale } from '@utils/scaling';
import { AccountListProps } from './AccountList.types';
import { AccountList } from './AccountList';

interface PaginatedAccountListProps extends AccountListProps {
  listProps?: AccountListProps['listProps'];
  onScrolIndexChange?: (newPosition: number) => void;
}

export const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const { accounts, listProps, onScrolIndexChange } = props;
  const cardList = useRef<FlatList>(null);
  const scrollPos = useRef(0);

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x;
    let newScrollPos = 0;
    const pageWidth = scale(300); // card width
    if (xPos >= scrollPos.current) {
      if (xPos - scrollPos.current >= scale(200)) {
        newScrollPos = Math.min(
          accounts.length * pageWidth,
          scrollPos.current + pageWidth
        );
      } else {
        newScrollPos = scrollPos.current;
      }
    } else {
      if (scrollPos.current - xPos >= scale(200)) {
        newScrollPos = Math.max(0, scrollPos.current - pageWidth);
      } else {
        newScrollPos = scrollPos.current;
      }
    }
    cardList.current?.scrollToOffset({
      animated: true,
      offset: newScrollPos
    });
    scrollPos.current = newScrollPos;
    const scrollIdx = Math.floor(scrollPos.current / pageWidth);
    if (typeof onScrolIndexChange === 'function') onScrolIndexChange(scrollIdx);
  };

  return (
    <AccountList
      ref={cardList}
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
