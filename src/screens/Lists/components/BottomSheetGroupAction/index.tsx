import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
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
  handleOnDeleteItem: (listId: string) => void;
  item: AccountList;
  handleOnRenameButtonPress: () => void;
};

export const BottomSheetGroupAction = forwardRef<BottomSheetRef, Props>(
  ({ handleOnDeleteItem, item, handleOnRenameButtonPress }, ref) => {
    const [status, setStatus] = useState('rename');
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
          {status === 'rename'
            ? `Edit ${item.name}`
            : `Are you sure want to remove selected Addresses from ${item.name}?`}
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
            {status ? 'Rename List' : 'Remove'}
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetDeleteButton}
          onPress={() => {
            if (status === 'delete') {
              handleOnDeleteItem(item.id);
            } else {
              setStatus('delete');
            }
          }}
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
