import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatButton } from '@components/base/FloatButton';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetCreateNewList } from '@screens/Lists/components/BottomSheetCreateNewList';
import { StatusBar } from 'expo-status-bar';
import { AddIcon } from '@components/svg/icons/AddIcon';

export const ListsScreen = () => {
  const [listName, setListName] = useState<string>('');
  const bottomRef = useRef<BottomSheetRef>(null);

  const handleOnCreateNewList = useCallback(() => {
    bottomRef.current?.show();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#222222" />
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.separateLine} />
        <ListsOfWallets />
      </SafeAreaView>
      <FloatButton
        title="Create new list"
        icon={<AddIcon />}
        onPress={handleOnCreateNewList}
      />
      <BottomSheetCreateNewList
        ref={bottomRef}
        listName={listName}
        handleListNameChange={setListName}
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
