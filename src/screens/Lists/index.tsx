import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListsOfAddressGroup } from './components/ListsOfAddressGroup';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyListsOfGroups } from '@screens/Lists/components/EmptyListsOfGroups';
import { getDataToSecureStore } from '@helpers/storageHelpers';
import { useLists } from '@contexts/ListsContext';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
export const ListsScreen = () => {
  const {
    setListsOfAddressGroup,
    listsOfAddressGroup,
    handleOnCreate,
    createGroupRef
  } = useLists((v) => v);
  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);
  useEffect(() => {
    const getDataGroups = async () => {
      const lists = await getDataToSecureStore('UserGroupsOfAddresses');
      setListsOfAddressGroup(lists || []);
    };
    getDataGroups();
  }, [setListsOfAddressGroup]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.separateLine} />
        {!listsOfAddressGroup.length ? (
          <EmptyListsOfGroups />
        ) : (
          <ListsOfAddressGroup listsOfAddressGroup={listsOfAddressGroup} />
        )}
      </SafeAreaView>
      <FloatButton
        title="Create new list"
        icon={<AddIcon />}
        onPress={handleOnOpenCreateNewList}
      />
      <BottomSheetCreateRenameGroup
        type="create"
        handleOnCreateGroup={handleOnCreate}
        ref={createGroupRef}
      />
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
