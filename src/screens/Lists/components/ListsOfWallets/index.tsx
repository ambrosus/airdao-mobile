import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
  },
  {
    title: 'Whales',
    subtitle: '5 wallets',
    price: '$2,000 (2,000 AMB)'
  }
];

export const ListsOfWallets = () => {
  return (
    <View style={styles.walletsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={mockedData}
        renderItem={({ item, index }) => {
          return <ListItem key={index} item={item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  walletsContainer: { flex: 1, flexGrow: 1 }
});
