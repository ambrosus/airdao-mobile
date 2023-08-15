import React from 'react';
import { FlatList, View } from 'react-native';
import { GroupItem } from '@screens/Portfolio/components/ListsOfAddressGroup/components/GroupItem';
import { AccountList } from '@models/AccountList';
import { styles } from '@screens/Portfolio/components/ListsOfAddressGroup/styles';
import { LocalizedRenderEmpty } from '@components/templates';
import { verticalScale } from '@utils/scaling';
import { Spacer } from '@components/base';

type Props = {
  listsOfAddressGroup: AccountList[];
  onRefresh?: () => void;
};
export const ListsGroups = ({ listsOfAddressGroup, onRefresh }: Props) => {
  if (listsOfAddressGroup.length === 0) {
    return (
      <>
        <Spacer value={20} />
        <LocalizedRenderEmpty text={'no.groups.yet'} />
      </>
    );
  }

  return (
    <View testID="lists-groups" style={styles.groupsContainer}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150,
          paddingTop: verticalScale(16)
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
        onRefresh={onRefresh}
        refreshing={false}
      />
    </View>
  );
};
