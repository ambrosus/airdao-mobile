import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { GroupItem } from '@screens/Portfolio/components/ListsOfAddressGroup/components/GroupItem';
import { AccountList } from '@models/AccountList';
import { WalletItem } from '@components/templates';

type Props = {
  listsOfAddressGroup: AccountList[];
};
export const ListsGroups = ({ listsOfAddressGroup }: Props) => {
  return (
    <View testID="lists-groups" style={styles.groupsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listsOfAddressGroup}
        renderItem={({ item, index }: { item: AccountList; index: number }) => {
          return (
            <GroupItem key={index} group={item} isFirstItem={index === 0} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  groupsContainer: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 20
  }
});
