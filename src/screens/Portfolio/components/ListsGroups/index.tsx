import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { useLists } from '@contexts/ListsContext';
import { styles } from '@screens/Portfolio/components/ListsGroups/styles';
import { EmptyListsIcon } from '@components/svg/icons/Empty';
import { verticalScale } from '@utils/scaling';

export const EmptyListsOfGroups = () => {
  const { handleOnCreate, createGroupRef } = useLists((v) => v);

  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);

  return (
    <View testID="empty-lists-of-groups" style={styles.container}>
      <EmptyListsIcon />
      <Spacer value={verticalScale(16)} />
      <Text
        fontFamily="Inter_400Regular"
        fontSize={15}
        color={COLORS.lightGrey}
      >
        Nothing to see here...yet
      </Text>
      <Button
        onPress={handleOnOpenCreateNewList}
        type="base"
        style={styles.createButton}
      >
        <Row justifyContent="space-between" alignItems="center">
          <AddIcon />
          <Text
            testID="create-new-list-button"
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
