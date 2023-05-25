import React from 'react';
import { FlatList, View } from 'react-native';
import { GroupItem } from '@screens/Portfolio/components/ListsOfAddressGroup/components/GroupItem';
import { AccountList } from '@models/AccountList';
import { styles } from '@screens/Portfolio/components/ListsOfAddressGroup/styles';
import { RenderEmpty } from '@components/templates/RenderEmpty';

type Props = {
  listsOfAddressGroup: AccountList[];
};
export const ListsGroups = ({ listsOfAddressGroup }: Props) => {
  if (listsOfAddressGroup.length === 0) {
    return <RenderEmpty text="collections" />;
  }

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
