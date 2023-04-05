import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatButton } from '@components/base/FloatButton';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetCreateNewList } from '@screens/Lists/components/BottomSheetCreateNewList';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { EmptyLists } from '@screens/Lists/components/EmptyLists';
import { getData } from '@helpers/storageHelpers';
import { useLists } from '@contexts/ListsContext';
export const ListsScreen = () => {
  const { listsOfWallets, setListsOfWallets, handleOnCreate } = useLists(
    (v) => v
  );
  const bottomRef = useRef<BottomSheetRef>(null);
  const handleOnOpenCreateNewList = useCallback(() => {
    bottomRef.current?.show();
  }, []);

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
      <BottomSheetCreateNewList
        handleOnCreateList={handleOnCreate}
        ref={bottomRef}
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
