import React, { forwardRef } from 'react';
import { AccountListItemProps, AccountListProps } from './AccountList.types';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { AccountDBModel } from '@database';
import {
  CreditCardAddressColor,
  CreditCardBalanceColor,
  CreditCardBg
} from '@constants/colors';
import { AccountListItem } from './AccountListItem';

export const AccountList = forwardRef<FlatList, AccountListProps>(
  (props: AccountListProps, ref) => {
    const { accounts, horizontal, type, listProps } = props;

    const renderAccount = (args: ListRenderItemInfo<AccountDBModel>) => {
      const { item, index } = args;
      const idx = index % CreditCardBg.length;
      const cardProps: AccountListItemProps['cardProps'] = {
        backgroundColor: CreditCardBg[idx],
        addressTextColor: CreditCardAddressColor[idx],
        priceTextColor: CreditCardBalanceColor[idx]
      };
      return (
        <AccountListItem account={item} type={type} cardProps={cardProps} />
      );
    };
    return (
      <FlatList
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(account) => account.address}
        {...listProps}
        ref={ref}
      />
    );
  }
);
