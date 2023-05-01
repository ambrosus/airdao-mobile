import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { styles } from '@screens/Lists/screens/SingleAddressGroupScreen/modals/BottomSheetRenameAddress/styles';

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

    return (
      <>
        <BottomSheet height={400} ref={localRef} isNestedSheet={true}>
          <View style={styles.icon}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={29} />
          <View style={styles.newListTitle}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={20}
              color={COLORS.smokyBlack}
            >
              Rename Address
            </Text>
          </View>
          <Spacer value={36} />
          <View style={styles.bottomSheetSubtitle}>
            <Text fontFamily="Inter_500Medium" fontSize={16} color={COLORS.oil}>
              List name
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
          <Spacer value={32} />
          <Button
            type="base"
            style={styles.bottomSheetCreateRenameButton}
            onPress={() => {
              handleOnRename(localAddressName !== address && localAddressName);
            }}
          >
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.white}
            >
              Rename
            </Text>
          </Button>
          <Spacer value={24} />
          <Button
            type="base"
            style={styles.bottomSheetCancelButton}
            onPress={() => localRef.current?.dismiss()}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              color={COLORS.midnight}
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
