import React, { ForwardedRef, useCallback, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { BottomSheetSingleAddressOptions } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressOptions';
import { BottomSheetSingleAddressAction } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetSingleAddressAction';
import { BottomSheetListSelection } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetListSelection';

type Props = {
  handleOpenSingleAddressAction?: () => void;
  item: ListsOfAddressType;
};
const AddressItem = React.forwardRef<BottomSheetRef, Props>(
  ({ item, handleOpenSingleAddressAction }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const optionsRef = useRef<BottomSheetRef>(null);
    const listSelectionRef = useRef<BottomSheetRef>(null);

    const handleOnLongPress = useCallback(() => {
      listSelectionRef.current?.show();
    }, []);

    const handleOnOpenOptions = useCallback(() => {
      optionsRef.current?.show();
    }, []);
    return (
      <>
        <TouchableOpacity
          onLongPress={handleOnLongPress}
          style={styles.flatListContainer}
        >
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
                onPress={handleOnOpenOptions}
              >
                <OptionsIcon />
              </Button>
            </View>
          </View>
        </TouchableOpacity>
        <Spacer value={32} />
        <BottomSheetSingleAddressOptions ref={optionsRef} item={item} />
        <BottomSheetSingleAddressAction ref={localRef} address={item} />
        <BottomSheetListSelection ref={listSelectionRef} />
      </>
    );
  }
);

// <>
//     <AddressItemComponent/>
//     <CheckBox/>
// </>
//
// <>
//     <AddressItemComponent/>
//     <SomeOptionsButton/>
// </>
export default AddressItem;
