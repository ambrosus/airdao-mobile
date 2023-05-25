import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Platform, View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@components/templates/BottomSheetCreateCollectionOrAddAddress/styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleCreateCollectionPress: () => void;
  handleOnAddNewAddress: () => void;
};

export const BottomSheetCreateCollectionOrAddAddress = forwardRef<
  BottomSheetRef,
  Props
>(({ handleCreateCollectionPress, handleOnAddNewAddress }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const bottomSafeArea = useSafeAreaInsets().bottom - 10;

  return (
    <View testID="Add_Address_Or_Create_Collection_Modal">
      <BottomSheet
        height={250}
        ref={localRef}
        containerStyle={
          Platform.OS === 'android' && { marginBottom: bottomSafeArea }
        }
      >
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.swiperIcon}>
              <BottomSheetSwiperIcon />
            </View>
            <Spacer value={scale(24)} />
            <Button
              onPress={handleOnAddNewAddress}
              type="circular"
              style={styles.addAddressButton}
            >
              <Text
                testID="Add_Address"
                style={{ marginVertical: 12 }}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.white}
              >
                Add Address
              </Text>
            </Button>
            <Spacer value={scale(24)} />
            <Button
              onPress={handleCreateCollectionPress}
              type="circular"
              style={styles.createCollectionButton}
            >
              <Text
                testID="Create_Collection"
                style={{ marginVertical: 12 }}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.smokyBlack}
              >
                Create Collection
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
});
