import React, { ForwardedRef } from 'react';
import { View } from 'react-native';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

type Props = {
  handleOpenSingleAddressAction: () => void;
  item: ListsOfAddressType;
};
const AddressItem = React.forwardRef<BottomSheetRef, Props>(
  ({ item, handleOpenSingleAddressAction }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <>
        <View style={styles.flatListContainer}>
          <View style={styles.whalesTokenContainer}>
            <View style={styles.infoContainer}>
              <Row>
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={13}
                  color={COLORS.black}
                >
                  {item.addressTitle}
                </Text>
              </Row>
              <Spacer value={4} />
              <Text
                fontFamily="Mersad_600SemiBold"
                fontSize={13}
                color={COLORS.thinGrey}
              >
                {item.addressToken}
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
                {item.addressPrice}
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
                  {item.addressProgress}
                </Text>
              </Row>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.actionButton}
                type="base"
                onPress={handleOpenSingleAddressAction}
              >
                <OptionsIcon />
              </Button>
            </View>
          </View>
          <BottomSheetSingleAddressAction ref={localRef} address={item} />
        </View>
        <Spacer value={32} />
      </>
    );
  }
);

export default AddressItem;
