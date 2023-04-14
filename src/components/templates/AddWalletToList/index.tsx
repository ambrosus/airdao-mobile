import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import {
  ListsOfAddressType,
  ListsOfAddressesGroupType
} from '@appTypes/ListsOfAddressGroup';
import { Button, Row, Spacer, Text } from '@components/base';
import { CheckBox } from '@components/composite';
import { verticalScale } from '@utils/scaling';
import { styles } from './styles';

interface AddWalletToListProps {
  wallet: ListsOfAddressType;
  lists: ListsOfAddressesGroupType[];
  onPressList: (list: ListsOfAddressesGroupType) => unknown;
}

export const AddWalletToList = (props: AddWalletToListProps): JSX.Element => {
  const { wallet, lists, onPressList } = props;

  const renderList = (args: ListRenderItemInfo<ListsOfAddressesGroupType>) => {
    const { item: list } = args;
    const selected = list.listOfAddresses.indexOfItem(wallet, 'addressId') > -1;
    const onPress = () => {
      onPressList(list);
    };

    return (
      <Button onPress={onPress}>
        <Row alignItems="center" justifyContent="space-between">
          <View>
            <Text fontSize={17} fontFamily="Inter_700Bold" fontWeight="600">
              {list.groupTitle}
            </Text>
            <Spacer value={verticalScale(4)} />
            <Text fontSize={16} fontWeight="400" fontFamily="Inter_400Regular">
              {list.addressesCount} Addresses
            </Text>
          </View>
          <CheckBox
            type="square"
            value={selected}
            fillColor="#2f2b4399"
            color="#FFFFFF"
          />
        </Row>
      </Button>
    );
  };

  return (
    <FlatList
      data={lists}
      renderItem={renderList}
      keyExtractor={(l) => l.groupId}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <Spacer value={verticalScale(28)} />}
    />
  );
};
