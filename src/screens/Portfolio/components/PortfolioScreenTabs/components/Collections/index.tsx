import { View } from 'react-native';
import React from 'react';
import { ListsGroups } from '@screens/Portfolio/components/ListsOfAddressGroup';
import { useAllAddressesContext, useLists } from '@contexts';

export const Collections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);
  const { refresh: refetchAddresses } = useAllAddressesContext((v) => v);
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <ListsGroups
        listsOfAddressGroup={listsOfAddressGroup}
        onRefresh={refetchAddresses}
      />
    </View>
  );
};
