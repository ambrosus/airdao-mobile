import { FlatList, View } from 'react-native';
import { Button } from '@components/base';
import React, { FC, useMemo } from 'react';
import { styles } from '@screens/List/styles';
import { WalletItem } from '@components/templates';
import { AccountList, ExplorerAccount } from '@models';
import { useLists } from '@contexts';

type Props = {
  group: AccountList;
};

export const Watchlists: FC<Props> = ({ group: { groupId } }) => {
  const { listsOfAddressGroup } = useLists((v) => v);
  const selectedList = useMemo(
    () => listsOfAddressGroup.filter((group) => group.id === groupId)[0] || {},
    [groupId, listsOfAddressGroup]
  );
  const { accounts } = selectedList;

  const navigateToAddressDetails = (item: ExplorerAccount) => {
    navigation.navigate('Address', { address: item.address });
  };

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={accounts}
        renderItem={({ item }) => {
          return (
            <View style={styles.addressItemContainer}>
              <Button
                onPress={() => navigateToAddressDetails(item)}
                style={styles.touchableAreaContainer}
              >
                <WalletItem item={item} />
              </Button>
            </View>
          );
        }}
      />
    </View>
  );
};
