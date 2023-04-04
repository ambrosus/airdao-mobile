import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListItem } from '@screens/Lists/components/ListsOfWallets/components/ListItem';

export type WalletGroup = {
  title: string;
  wallets: string;
  tokens: string;
  listOfWallets: ListOfWallets[];
};

export type ListOfWallets = {
  wallet: string;
  price: string;
  token: string;
  progress: string;
};

const mockedData: WalletGroup[] = [
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
  },
  {
    title: 'Whales',
    wallets: '5 wallets',
    tokens: '$2,000 (2,000 AMB)',
    listOfWallets: [
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      },
      {
        wallet: 'Wallet 01',
        price: '$45,000',
        token: '20 AMB',
        progress: '3.46%'
      }
    ]
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
