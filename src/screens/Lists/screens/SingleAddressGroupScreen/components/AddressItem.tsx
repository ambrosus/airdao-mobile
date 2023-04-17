import React, { ForwardedRef } from 'react';
import { View } from 'react-native';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction';
import { ExplorerAccount } from '@models/Explorer';

type Props = {
  handleOpenSingleAddressAction?: () => void;
  item: ExplorerAccount;
};
const AddressItem = React.forwardRef<BottomSheetRef, Props>(({ item }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  return (
    <>
      <View style={styles.whalesTokenContainer}>
        <View style={styles.infoContainer}>
          <Row>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={13}
              color={COLORS.black}
            >
              {item.name}
            </Text>
          </Row>
          <Spacer value={4} />
          <Text
            fontFamily="Mersad_600SemiBold"
            fontSize={13}
            color={COLORS.thinGrey}
          >
            {item.ambBalance}
          </Text>
        </View>
      </View>
      <View style={styles.priceProgressContainer}>
        <View style={styles.contentContainer}>
          <Text
            fontFamily="Mersad_600SemiBold"
            fontSize={13}
            color={COLORS.black}
          >
            {item.ambBalance}
          </Text>
          <Spacer value={4} />
          <Row justifyContent="space-between" alignItems="center">
            <ProgressArrowIcon />
            <Text
              fontFamily="Mersad_600SemiBold"
              fontSize={12}
              color={COLORS.thinGrey}
              style={styles.progressIcon}
            >
              3.46%
            </Text>
          </Row>
        </View>
      </View>
      <BottomSheetSingleAddressAction ref={localRef} addresses={[item]} />
    </>
  );
});
export default AddressItem;
