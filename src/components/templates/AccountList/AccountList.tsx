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
import { Button } from '@components/base';

export const AccountList = forwardRef<FlatList, AccountListProps>(
  (props: AccountListProps, ref) => {
    const { accounts, horizontal, type, listProps, onPressAccount } = props;

    const renderAccount = (args: ListRenderItemInfo<AccountDBModel>) => {
      const { item, index } = args;
      const idx = index % CreditCardBg.length;
      const cardProps: AccountListItemProps['cardProps'] = {
        backgroundColor: CreditCardBg[idx],
        addressTextColor: CreditCardAddressColor[idx],
        priceTextColor: CreditCardBalanceColor[idx]
      };
      const onPress = () => {
        if (typeof onPressAccount === 'function') {
          onPressAccount(item, index);
        }
      };
      return (
        <Button
          disabled={typeof onPressAccount !== 'function'}
          onPress={onPress}
          activeOpacity={0.75}
        >
          <AccountListItem account={item} type={type} cardProps={cardProps} />
        </Button>
      );
    };
    return (
      <FlatList
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(account, idx) => `${account.address}-${idx}`}
        {...listProps}
        ref={ref}
      />
    );
  }
);
