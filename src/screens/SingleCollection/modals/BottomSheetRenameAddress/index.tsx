import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { Platform, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { styles } from '@screens/SingleCollection/modals/BottomSheetRenameAddress/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRename: (newName: string | false) => void;
  address?: string;
  groupId?: string;
};
export const BottomSheetRenameAddress = forwardRef<BottomSheetRef, Props>(
  ({ address, handleOnRename }, ref) => {
    const [localAddressName, setLocalAddressName] = useState<string>(
      address || ''
    );
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const bottomSafeArea = useSafeAreaInsets().bottom - 10;

    return (
      <>
        <BottomSheet
          height={400}
          ref={localRef}
          isNestedSheet={false}
          containerStyle={
            Platform.OS === 'android' && { marginBottom: bottomSafeArea }
          }
        >
          <View style={styles.icon}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={24} />
          <View style={styles.bottomSheetSubtitle}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.nero}
            >
              Rename address
            </Text>
          </View>
          <Input
            value={localAddressName}
            onChangeValue={(value) => setLocalAddressName(value)}
            type="text"
            placeholder="Enter list name"
            placeholderTextColor="black"
            style={[styles.bottomSheetInput]}
          />
          <Spacer value={24} />
          <Button
            type="base"
            style={{
              backgroundColor: COLORS.deepBlue,
              marginHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center'
            }}
            onPress={() => {
              handleOnRename(localAddressName !== address && localAddressName);
            }}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.white}
            >
              Save
            </Text>
          </Button>
          <Spacer value={24} />
          <Button
            type="base"
            style={{
              backgroundColor: COLORS.charcoal,
              marginHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center'
            }}
            onPress={() => localRef.current?.dismiss()}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              color={COLORS.smokyBlack}
              fontSize={16}
            >
              Cancel
            </Text>
          </Button>
        </BottomSheet>
      </>
    );
  }
);
