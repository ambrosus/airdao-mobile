import { View } from 'react-native';
import React from 'react';
import { ListsGroups } from '@screens/Portfolio/components/ListsOfAddressGroup';
import { useAllAddressesContext, useLists } from '@contexts';
import { Spinner } from '@components/base';
import { sortListByKey } from '@utils/sort';

export const Collections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);
  const { refresh: refetchAddresses, addressesLoading } =
    useAllAddressesContext((v) => v);
  return (
    <View
      style={{
        flex: 1
      }}
    >
      {addressesLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Spinner />
        </View>
      ) : (
        <ListsGroups
          listsOfAddressGroup={sortListByKey(
            listsOfAddressGroup,
            'totalBalance',
            'desc'
          )}
          onRefresh={refetchAddresses}
        />
      )}
    </View>
  );
};
