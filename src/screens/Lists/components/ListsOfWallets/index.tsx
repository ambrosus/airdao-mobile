import React from 'react';
import { FlatList, View } from 'react-native';
import { ListItem } from '@screens/Lists/components/ListsOfWallets/components/ListItem';

const mockedData = [
  {
    title: 'Whales',
    subtitle: '5 wallets',
    price: '$2,000 (2,000 AMB)'
  },
  {
    title: 'Whales',
    subtitle: '5 wallets',
    price: '$2,000 (2,000 AMB)'
  },
  {
    title: 'Whales',
    subtitle: '5 wallets',
    price: '$2,000 (2,000 AMB)'
  },
  {
    title: 'Whales',
    subtitle: '5 wallets',
    price: '$2,000 (2,000 AMB)'
  }
];

export const ListsOfWallets = () => {
  return (
    <View style={{ height: '100%' }}>
      <FlatList
        data={mockedData}
        renderItem={({ item, index }) => {
          return <ListItem key={index} item={item} />;
        }}
      />
    </View>
  );
};
