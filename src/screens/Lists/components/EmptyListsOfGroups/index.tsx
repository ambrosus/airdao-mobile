import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { TokenLogo } from '@components/svg/icons/TokenLogo';

export const EmptyListsOfGroups = () => {
  const { handleOnCreate, createGroupRef } = useLists((v) => v);

  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);

  return (
    <View style={styles.container}>
      <TokenLogo />
      <Spacer value={16} />
      <Text
        fontFamily="Inter_400Regular"
        fontSize={15}
        color={COLORS.lightGrey}
      >
        Nothing to see here...yet
      </Text>
      <Spacer value={12} />
      <Button
        onPress={handleOnOpenCreateNewList}
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
      <BottomSheetCreateRenameGroup
        type="create"
        handleOnCreateGroup={handleOnCreate}
        ref={createGroupRef}
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
