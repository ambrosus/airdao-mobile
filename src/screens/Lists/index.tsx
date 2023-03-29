import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/atoms/Spacer';
import { COLORS } from '../../constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { AddIcon } from '@components/svg/AddIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatButton } from '@components/base/FloatButton';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';

export const ListsScreen = () => {
  const bottomRef = useRef<BottomSheetRef>(null);

  const handleOnCreateNewList = useCallback(() => {
    bottomRef.current?.show();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.lineStyle} />
        <ListsOfWallets />
      </SafeAreaView>
      <FloatButton
        title="Create new list"
        icon={<AddIcon />}
        onPress={handleOnCreateNewList}
      />
      <BottomSheet height={400} ref={bottomRef}>
        <Text>12312312312312</Text>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.darkGrey,
    opacity: 0.1
  }
});
