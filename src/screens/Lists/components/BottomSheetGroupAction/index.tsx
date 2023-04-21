import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet } from '@components/composite';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { AccountList } from '@models/AccountList';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnDeleteButtonPress: () => void;
  item: AccountList;
  handleOnRenameButtonPress: () => void;
  type: 'rename' | 'delete';
};
export const BottomSheetSingleGroupOption = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const {
      type = 'rename',
      handleOnDeleteButtonPress,
      item,
      handleOnRenameButtonPress
    } = props;
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={300} ref={localRef}>
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
          {type === 'rename'
            ? `Edit ${item.name}`
            : `Are you sure want to remove selected ${item.name} from lists?`}
        </Text>
        <Spacer value={32} />
        <Button
          type="base"
          style={styles.bottomSheetRenameButton}
          onPress={handleOnRenameButtonPress}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            {type === 'rename' ? 'Rename' : 'Delete'}
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetDeleteButton}
          onPress={handleOnDeleteButtonPress}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.buttonTextColor}
          >
            Delete List
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);
