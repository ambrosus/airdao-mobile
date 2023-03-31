import React, {
  Dispatch,
  ForwardedRef,
  forwardRef,
  RefObject,
  SetStateAction
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons/BottomSheetSwiper';

type Props = {
  listName: string;
  handleListNameChange: Dispatch<SetStateAction<string>>;
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetCreateNewList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const { listName, handleListNameChange } = props;
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <>
        <BottomSheet height={400} ref={localRef}>
          <View style={styles.icon}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={29} />
          <View style={styles.newListTitle}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={20}
              color={COLORS.black}
            >
              Create new List
            </Text>
          </View>
          <Spacer value={36} />
          <View style={styles.bottomSheetSubtitle}>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.dark}
            >
              List name
            </Text>
          </View>
          <Input
            value={listName}
            onChangeValue={handleListNameChange}
            type="text"
            placeholder="Enter list name"
            placeholderTextColor="black"
            style={[styles.bottomSheetInput]}
          />
          <Spacer value={32} />
          <Button
            disabled={!!listName.length}
            type="base"
            style={styles.bottomSheetCreateButton}
          >
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.black}
            >
              Create
            </Text>
          </Button>
          <Spacer value={24} />
          <Button
            type="base"
            style={styles.bottomSheetCancelButton}
            onPress={() => localRef.current?.dismiss()}
          >
            <Text>Cancel</Text>
          </Button>
        </BottomSheet>
      </>
    );
  }
);

const styles = StyleSheet.create({
  newListTitle: {
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    paddingTop: 16
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
    backgroundColor: COLORS.whiteGrey,
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
