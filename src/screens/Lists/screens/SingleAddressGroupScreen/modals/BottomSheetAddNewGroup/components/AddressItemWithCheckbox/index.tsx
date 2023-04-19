import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { View } from 'react-native';
import { styles } from '../../styles';
import { CheckBox } from '@components/base/CheckBox';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { ExplorerAccount } from '@models/Explorer';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import AddressItem from '@screens/Lists/screens/SingleAddressGroupScreen/components/AddressItem';

type Props = {
  item: ExplorerAccount;
  idsOfSelectedAddresses: string[];
  handleCheckBoxPress: (id: string) => void;
};
export const AddressItemWithCheckbox = ({
  item,
  idsOfSelectedAddresses,
  handleCheckBoxPress
}: Props) => {
  const { address, transactionCount, ambBalance } = item;
  return (
    <>
      <Spacer value={29} />
      <View style={styles.itemContainer}>
        <CheckBox
          onPress={() => handleCheckBoxPress(address)}
          isChecked={idsOfSelectedAddresses.includes(address)}
        />
        <AddressItem item={item} />
      </View>
    </>
  );
};
