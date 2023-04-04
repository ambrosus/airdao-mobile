import React, {
  Dispatch,
  ForwardedRef,
  forwardRef,
  RefObject,
  SetStateAction
} from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Input, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheetSwiperIcon } from '@components/svg/icons/BottomSheetSwiper';
import { StyleSheet, View } from 'react-native';

type Props = {
  listNameInput: string;
  handleListNameInputChange: Dispatch<SetStateAction<string>>;
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetRenameList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { listNameInput, handleListNameInputChange } = props;
    return (
      <BottomSheet height={385} ref={localRef} isNestedSheet={true}>
        <View style={styles.icon}>
          <BottomSheetSwiperIcon />
        </View>
        <Spacer value={29} />
        <View style={styles.title}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={20}
            color={COLORS.black}
          >
            Rename List
          </Text>
        </View>
        <Spacer value={36} />
        <View style={styles.bottomSheetSubtitle}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.dark}
          >
            List name
          </Text>
        </View>
        <Input
          value={listNameInput}
          onChangeValue={handleListNameInputChange}
          type="text"
          placeholder="Enter list name"
          placeholderTextColor="black"
          style={[styles.bottomSheetInput]}
        />
        <Spacer value={32} />
        <Button type="base" style={styles.bottomSheetCreateButton}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Rename
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          disabled={!!listNameInput.length}
          type="base"
          style={styles.bottomSheetCancelButton}
          onPress={() => localRef.current?.dismiss()}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.black}
            fontSize={16}
          >
            Cancel
          </Text>
        </Button>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  title: {
    alignSelf: 'center'
  },
  bottomSheetSubtitle: {
    paddingLeft: 16
  },
  bottomSheetInput: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.silver
  },
  bottomSheetCreateButton: {
    backgroundColor: COLORS.grey,
    marginHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  bottomSheetCancelButton: {
    marginHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center'
  }
});
