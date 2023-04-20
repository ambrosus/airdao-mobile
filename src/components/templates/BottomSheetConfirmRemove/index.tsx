import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { View } from 'react-native';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models/Explorer';
import { useLists } from '@contexts/ListsContext';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ExplorerAccount;
  groupId: string;
};

export const BottomSheetConfirmRemove = forwardRef<BottomSheetRef, Props>(
  ({ item, groupId }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { handleOnDeleteAddressFromGroup } = useLists((v) => v);

    return (
      <BottomSheet ref={localRef} height={375} isNestedSheet={true}>
        <View style={styles.icon}>
          <BottomSheetSwiperIcon />
        </View>
        <Spacer value={32} />
        <Text
          style={styles.text}
          fontFamily="Inter_600SemiBold"
          fontSize={20}
          color={COLORS.black}
        >
          Are you sure want to remove selected {item.address} from Whales?
        </Text>
        <Spacer value={24} />
        <Button
          onPress={() => {
            handleOnDeleteAddressFromGroup(groupId, [item.address]);
            localRef.current?.dismiss();
          }}
          style={styles.removeButton}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Remove
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
            color={COLORS.buttonTextColor}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);
