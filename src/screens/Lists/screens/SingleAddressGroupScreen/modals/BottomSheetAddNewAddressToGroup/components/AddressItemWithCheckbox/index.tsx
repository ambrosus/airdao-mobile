import React from 'react';
import { Spacer } from '@components/base';
import { View } from 'react-native';
import { styles } from '../../styles';
import { CheckBox } from '@components/composite';
import { ExplorerAccount } from '@models/Explorer';
import { WalletItem } from '@components/templates';
import { COLORS } from '@constants/colors';

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
  const { address } = item;
  return (
    <>
      <Spacer value={29} />
      <View style={styles.itemContainer}>
        <View style={styles.checkboxPadding}>
          <CheckBox
            onValueChange={() => handleCheckBoxPress(address)}
            type="square"
            value={idsOfSelectedAddresses.includes(address)}
            fillColor={COLORS.sapphireBlue}
            color={COLORS.white}
          />
        </View>
        <WalletItem item={item} />
      </View>
    </>
  );
};
