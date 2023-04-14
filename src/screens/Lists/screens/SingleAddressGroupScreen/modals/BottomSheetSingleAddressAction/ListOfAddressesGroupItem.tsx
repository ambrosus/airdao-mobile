import React, { useEffect } from 'react';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction/styles';
import { View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CheckBox } from '@components/base/CheckBox';
import {
  ListsOfAddressesGroupType,
  ListsOfAddressType
} from '@appTypes/ListsOfAddressGroup';

type Props = {
  item: ListsOfAddressesGroupType;
  handleOnCheckboxPress: (selectedAddressId: string) => void;
  idsOfSelectedGroups: string[];
  pressedAddresses: ListsOfAddressType[];
  isAddressAlreadyInList: boolean;
};
export const ListOfAddressesGroupItem = ({
  item,
  pressedAddresses,
  isAddressAlreadyInList,
  handleOnCheckboxPress,
  idsOfSelectedGroups
}: Props) => {
  useEffect(() => {
    if (isAddressAlreadyInList && !idsOfSelectedGroups.includes(item.groupId)) {
      handleOnCheckboxPress(item.groupId);
    }
  }, [
    handleOnCheckboxPress,
    idsOfSelectedGroups,
    isAddressAlreadyInList,
    item.groupId
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.itemInfo}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={17}
          color={COLORS.black}
          style={styles.itemTitle}
        >
          {item.groupTitle}
        </Text>
        <Spacer value={4} />
        <View style={styles.itemSubInfo}>
          <Text fontFamily="Inter_400Regular" fontSize={16}>
            {isAddressAlreadyInList
              ? `${pressedAddresses
                  .map((address) => address.addressTitle)
                  .join(', ')} is already on this list`
              : `${item.addressesCount} Addresses`}
          </Text>
        </View>
      </View>
      <CheckBox
        onPress={() => {
          handleOnCheckboxPress(item.groupId);
        }}
        isChecked={idsOfSelectedGroups.includes(item.groupId)}
      />
    </View>
  );
};
