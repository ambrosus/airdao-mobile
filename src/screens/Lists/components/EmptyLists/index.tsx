import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetCreateRenameList } from '@components/templates/BottomSheetCreateRenameList';

export const EmptyLists = () => {
  const bottomRef = useRef<BottomSheetRef>(null);
  const handleOnCreateNewList = useCallback(() => {
    bottomRef.current?.show();
  }, []);
  return (
    <View style={styles.container}>
      <Text
        fontFamily="Inter_400Regular"
        fontSize={15}
        color={COLORS.lightGrey}
      >
        Nothing to see here...yet
      </Text>
      <Spacer value={12} />
      <Button
        onPress={handleOnCreateNewList}
        type="base"
        style={styles.createButton}
      >
        <Row justifyContent="space-between" alignItems="center">
          <AddIcon />
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
            style={styles.text}
          >
            Create new list
          </Text>
        </Row>
      </Button>
      <BottomSheetCreateRenameList
        type="create"
        ref={bottomRef}
        handleOnCreateList={handleOnCreateNewList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 25,
    backgroundColor: COLORS.grey
  },
  text: {
    paddingLeft: 10
  }
});
