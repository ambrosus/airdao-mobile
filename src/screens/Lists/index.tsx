import React, { useCallback, useMemo } from 'react';
import { Spacer } from '@components/base/Spacer';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLists } from '@contexts/ListsContext';
import { FloatButton } from '@components/base/FloatButton';
import { EmptyListsOfGroups } from '@screens/Lists/components/ListsGroups';
import { ListsGroups } from '@screens/Lists/components/ListsOfAddressGroup';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { PlusIcon } from '@components/svg/icons';
import { styles } from '@screens/Lists/styles';
import { Separator } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

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
        <Spacer value={verticalScale(33)} />
        <Separator />
        {!listsOfAddressGroup.length ? (
          <EmptyListsOfGroups />
        ) : (
          <>
            <ListsGroups listsOfAddressGroup={listsOfAddressGroup} />
            <FloatButton
              titleStyle={styles.floatButtonTitle}
              title="Create new list"
              icon={<PlusIcon color={COLORS.white} />}
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
