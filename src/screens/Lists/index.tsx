import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { COLORS } from '@constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { useLists } from '@contexts/ListsContext';
import { FloatButton } from '@components/base/FloatButton';
import { EmptyListsOfGroups } from '@screens/Lists/components/ListsGroups';
import { ListsGroups } from '@screens/Lists/components/ListsOfAddressGroup';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { PlusIcon } from '@components/svg/icons';
import { styles } from '@screens/Lists/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={{ flex: 1 }} testID="lists-screen">
      <ListsScreenHeader totalAmount={totalAmount} />
      <Spacer value={32} />
      <View style={styles.separateLine} />
      {!listsOfAddressGroup.length ? (
        <EmptyListsOfGroups />
      ) : (
        <>
          <ListsGroups listsOfAddressGroup={listsOfAddressGroup} />
          <FloatButton
            testID="float-button"
            titleStyle={styles.floatButtonTitle}
            title="Create new list"
            icon={<PlusIcon color={COLORS.white} />}
            onPress={handleOnOpenCreateNewList}
          />
        </>
      )}
      <View testID="query-bottom-sheet-create">
        <BottomSheetCreateRenameGroup
          type="create"
          handleOnCreateGroup={handleOnCreate}
          ref={createGroupRef}
        />
      </View>
    </SafeAreaView>
  );
};
