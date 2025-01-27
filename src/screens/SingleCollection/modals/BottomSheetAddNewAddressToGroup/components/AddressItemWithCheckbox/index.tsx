import { View } from 'react-native';
import { Spacer } from '@components/base';
import { CheckBox } from '@components/composite';
import { WalletItem } from '@components/templates';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models/Explorer';
import { styles } from '../../styles';

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
            color={COLORS.neutral0}
          />
        </View>
        <WalletItem item={item} />
      </View>
    </>
  );
};
