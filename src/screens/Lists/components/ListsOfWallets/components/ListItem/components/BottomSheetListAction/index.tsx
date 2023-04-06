import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet } from '@components/composite';
import { Button, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';
import { styles } from '@screens/Lists/components/ListsOfWallets/components/ListItem/components/BottomSheetListAction/styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnDeleteItem: (listId: string) => void;
  item: WalletGroup;
};

export const BottomSheetListAction = forwardRef<BottomSheetRef, Props>(
  ({ handleOnDeleteItem, item }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={375} ref={localRef}>
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
          Whales
        </Text>
        <Spacer value={32} />
        <Button type="base" style={styles.bottomSheetButton}>
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.black}
          >
            Rename List
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetButton}
          onPress={() => {
            handleOnDeleteItem(item.id);
            localRef.current?.dismiss();
          }}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.black}
          >
            Delete List
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);
