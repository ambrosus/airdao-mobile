import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { GroupItem } from '@screens/Lists/components/ListsOfAddressGroup/components/GroupItem';
import { AccountList } from '@models/AccountList';

type Props = {
  listsOfAddressGroup: AccountList[];
};
export const ListsGroups = ({ listsOfAddressGroup }: Props) => {
  return (
    <View style={styles.groupsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listsOfAddressGroup}
        renderItem={({ item, index }) => {
          return <GroupItem key={index} group={item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  groupsContainer: { flex: 1, flexGrow: 1 }
});
