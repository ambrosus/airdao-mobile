import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { EmptyLists } from '@screens/Lists/components/EmptyLists';
import { getData } from '@helpers/storageHelpers';
import { useLists } from '@contexts/ListsContext';
import { BottomSheetCreateRenameList } from '@components/templates/BottomSheetCreateRenameList';
export const ListsScreen = () => {
  const { listsOfWallets, setListsOfWallets, handleOnCreate, createListRef } =
    useLists((v) => v);

  const handleOnOpenCreateNewList = useCallback(() => {
    createListRef.current?.show();
  }, [createListRef]);

  useEffect(() => {
    const getDataLists = async () => {
      const lists = await getData('UserWalletsLists');
      setListsOfWallets(lists || []);
    };
    getDataLists();
  }, [setListsOfWallets]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.separateLine} />
        {!listsOfWallets.length ? (
          <EmptyLists />
        ) : (
          <ListsOfWallets listsOfWallets={listsOfWallets} />
        )}
      </SafeAreaView>
      <FloatButton
        title="Create new list"
        icon={<AddIcon />}
        onPress={handleOnOpenCreateNewList}
      />
      <BottomSheetCreateRenameList
        type="create"
        handleOnCreateList={handleOnCreate}
        ref={createListRef}
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
