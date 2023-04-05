import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListItem } from '@screens/Lists/components/ListsOfWallets/components/ListItem';

export type WalletGroup = {
  id: string;
  title: string;
  addresses: number;
  tokens: number;
  listOfWallets: ListOfWallets[];
};

export type ListOfWallets = {
  wallet: string;
  price: string;
  token: string;
  progress: string;
};

type Props = {
  listsOfWallets: WalletGroup[];
};
export const ListsOfWallets = ({ listsOfWallets }: Props) => {
  return (
    <View style={styles.walletsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listsOfWallets}
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
