import React, { useEffect } from 'react';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressMove/styles';
import { View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AccountList } from '@models/AccountList';
import { CheckBox } from '@components/composite';
import { StringUtils } from '@utils/string';

type Props = {
  item: AccountList;
  handleOnCheckboxPress: (selectedAddressId: string) => void;
  idsOfSelectedGroups: string[];
  pressedAddresses: string[];
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

  // console.log(isAddressAlreadyInList);
  return (
    <View style={styles.container}>
      <View style={styles.itemInfo}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={17}
          color={COLORS.smokyBlack}
          style={styles.itemTitle}
        >
          {item.name}
        </Text>
        <Spacer value={4} />
        <View style={styles.itemSubInfo}>
          <Text fontFamily="Inter_400Regular" fontSize={16}>
            {isAddressAlreadyInList
              ? `${pressedAddresses
                  .map((address) => StringUtils.formatAddress(address, 3, 4))
                  .join(', ')} is already on this list`
              : `${item.accountCount} Addresses`}
          </Text>
        </View>
      </View>
      <CheckBox
        onValueChange={() => {
          handleOnCheckboxPress(item.id);
        }}
        type="square"
        fillColor={COLORS.sapphireBlue}
        color={COLORS.white}
        value={idsOfSelectedGroups.includes(item.id)}
      />
    </View>
  );
};
