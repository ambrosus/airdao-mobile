import React from 'react';
import { FlatList, View } from 'react-native';
import { LocalizedRenderEmpty } from '@components/templates';
import { AccountList } from '@models/AccountList';
import { verticalScale } from '@utils';
import { styles } from './styles';
import { GroupItem } from '../ListsOfAddressGroup/components/GroupItem';

type Props = {
  listsOfAddressGroup: AccountList[];
  onRefresh?: () => void;
};
export const ListsGroups = ({ listsOfAddressGroup, onRefresh }: Props) => {
  return (
    <View testID="lists-groups" style={styles.groupsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listsOfAddressGroup}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }: { item: AccountList; index: number }) => {
          return (
            <GroupItem
              key={index}
              group={item}
              isFirstItem={index === 0}
              swipeable
            />
          );
        }}
        ListEmptyComponent={
          <View style={{ paddingTop: verticalScale(200) }}>
            <LocalizedRenderEmpty text={'empty.groups'} />
          </View>
        }
        onRefresh={onRefresh}
        refreshing={false}
      />
    </View>
  );
};
