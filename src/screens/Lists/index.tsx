import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLists } from '@contexts/ListsContext';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { EmptyListsOfGroups } from '@screens/Lists/components/ListsGroups';
import { ListsGroups } from '@screens/Lists/components/ListsOfAddressGroup';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
export const ListsScreen = () => {
  const { listsOfAddressGroup, handleOnCreate, createGroupRef } = useLists(
    (v) => v
  );

  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);

  const totalAmount = useMemo(() => {
    return listsOfAddressGroup.reduce(
      (partialSum, el) => partialSum + el.totalBalance,
      0
    );
  }, [listsOfAddressGroup]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader totalAmount={totalAmount} />
        <Spacer value={32} />
        <View style={styles.separateLine} />
        {!listsOfAddressGroup.length ? (
          <EmptyListsOfGroups />
        ) : (
          <>
            <ListsGroups listsOfAddressGroup={listsOfAddressGroup} />
            <FloatButton
              title="Create new list"
              icon={<AddIcon />}
              onPress={handleOnOpenCreateNewList}
            />
          </>
        )}
        <BottomSheetCreateRenameGroup
          type="create"
          handleOnCreateGroup={handleOnCreate}
          ref={createGroupRef}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  separateLine: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.darkGrey,
    opacity: 0.1
  }
});
