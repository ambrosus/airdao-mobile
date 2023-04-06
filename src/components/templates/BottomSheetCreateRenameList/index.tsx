import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRenameList?: (selectedListId: string, newListName: string) => void;
  handleOnCreateList?: (value: string) => void;

  listTitle?: string;
  listId?: string;
  type: 'rename' | 'create';
};
export const BottomSheetCreateRenameList = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const {
      handleOnRenameList,
      listTitle,
      type = 'create',
      handleOnCreateList,
      listId
    } = props;
    const [listName, setListName] = useState<string>(listTitle || '');
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
              {type === 'create' ? ' Create new List' : 'Rename List'}
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
            onChangeValue={(value) => setListName(value)}
            type="text"
            placeholder={'Enter list name'}
            placeholderTextColor="black"
            style={[styles.bottomSheetInput]}
          />
          <Spacer value={32} />
          <Button
            disabled={!listName.length}
            type="base"
            style={styles.bottomSheetCreateButton}
            onPress={() => {
              if (handleOnCreateList) {
                handleOnCreateList(listName);
              }
              if (handleOnRenameList && listId) {
                handleOnRenameList(listId, listName);
              }
            }}
          >
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.black}
            >
              {type === 'create' ? 'Create' : 'Rename'}
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
              color={COLORS.black}
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
