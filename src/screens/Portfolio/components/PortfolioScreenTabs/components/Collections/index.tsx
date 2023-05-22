import { View } from 'react-native';
import React from 'react';
import { ListsGroups } from '@screens/Portfolio/components/ListsOfAddressGroup';
import { useLists } from '@contexts';

export const Collections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <ListsGroups listsOfAddressGroup={listsOfAddressGroup} />
    </View>
  );
};
