import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { BottomSheetRenameList } from '@screens/Lists/screens/SIngleListScreen/components/BottomSheetOptions/components/BottomSheetRenameList';
import { BottomSheetDeleteList } from '@screens/Lists/screens/SIngleListScreen/components/BottomSheetOptions/components/BottomSheetDeleteList';
import { BottomSheetSwiperIcon } from '@components/svg/icons';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetOptions = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const renameListRef = useRef<BottomSheetRef>(null);
    const deleteListRef = useRef<BottomSheetRef>(null);
    const handleOnRenameList = useCallback(() => {
      renameListRef.current?.show();
    }, []);
    const handleOnDeleteList = useCallback(() => {
      deleteListRef.current?.show();
    }, []);
    const [listNameInput, setListNameInput] = useState<string>('');
    return (
      <BottomSheet height={236} ref={localRef}>
        <View style={styles.icon}>
          <BottomSheetSwiperIcon />
        </View>
        <Spacer value={43} />
        <Button
          type="base"
          style={styles.renameListButton}
          onPress={handleOnRenameList}
        >
          <Text
            style={styles.cancelButtonText}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Rename List
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          onPress={handleOnDeleteList}
          type="base"
          style={styles.deleteListButton}
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
        <BottomSheetRenameList
          ref={renameListRef}
          listNameInput={listNameInput}
          handleListNameInputChange={setListNameInput}
        />
        <BottomSheetDeleteList ref={deleteListRef} />
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingTop: 16
  },
  renameListButton: {
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.grey
  },
  deleteListButton: {
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.whiteGrey
  },
  cancelButtonText: {
    paddingVertical: 12,
    alignSelf: 'center'
  }
});
