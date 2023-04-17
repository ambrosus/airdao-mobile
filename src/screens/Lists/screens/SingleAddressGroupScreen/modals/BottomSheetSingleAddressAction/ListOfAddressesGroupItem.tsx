import React, { useEffect } from 'react';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction/styles';
import { View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CheckBox } from '@components/base/CheckBox';
import { AccountList } from '@models/AccountList';
import { ExplorerAccount } from '@models/Explorer';

type Props = {
  item: AccountList;
  handleOnCheckboxPress: (selectedAddressId: string) => void;
  idsOfSelectedGroups: string[];
  pressedAddresses: ExplorerAccount[];
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
    if (isAddressAlreadyInList && !idsOfSelectedGroups.includes(item.id)) {
      handleOnCheckboxPress(item.id);
    }
  }, [
    handleOnCheckboxPress,
    idsOfSelectedGroups,
    isAddressAlreadyInList,
    item.id
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
          {item.name}
        </Text>
        <Spacer value={4} />
        <View style={styles.itemSubInfo}>
          <Text fontFamily="Inter_400Regular" fontSize={16}>
            {isAddressAlreadyInList
              ? `${pressedAddresses
                  .map((address) => address.name)
                  .join(', ')} is already on this list`
              : `${item.addressCount} Addresses`}
          </Text>
        </View>
      </View>
      <CheckBox
        onPress={() => {
          handleOnCheckboxPress(item.id);
        }}
        isChecked={idsOfSelectedGroups.includes(item.id)}
      />
    </View>
  );
};
