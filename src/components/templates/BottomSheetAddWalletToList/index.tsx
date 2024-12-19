import React, { forwardRef, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { COLORS } from '@constants/colors';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useListActions } from '@features/lists';
import { verticalScale } from '@utils';
import { AddWalletToList, AddWalletToListProps } from '../AddWalletToList';

interface BottomSheetAddWalletToListProps extends AddWalletToListProps {
  title: string;
}

export const BottomSheetAddWalletToList = forwardRef<
  BottomSheetRef,
  BottomSheetAddWalletToListProps
>(({ title, ...addWalletToListProps }, ref) => {
  const { t } = useTranslation();

  const createGroupRef = useRef<BottomSheetRef>(null);

  const onDismissBottomSheet = useCallback(
    () => createGroupRef.current?.dismiss(),
    [createGroupRef]
  );

  const { onCreateList } = useListActions(onDismissBottomSheet);

  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  return (
    <BottomSheet
      ref={ref}
      height={DEVICE_HEIGHT * 0.58}
      swiperIconVisible={true}
    >
      <Spacer value={verticalScale(24)} />
      <Text
        fontSize={18}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral800}
        align="center"
      >
        {title}
      </Text>
      <Spacer value={verticalScale(24)} />
      <AddWalletToList {...addWalletToListProps} />
      <Spacer value={verticalScale(15)} />
      <PrimaryButton
        onPress={() => {
          showCreateNewListModal();
        }}
        style={{ width: '90%', alignSelf: 'center' }}
      >
        <Text
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral0}
          fontSize={16}
        >
          {t('collection.create.new')}
        </Text>
      </PrimaryButton>
      <Spacer value={verticalScale(30)} />
      <BottomSheetCreateRenameGroup
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={onCreateList}
      />
    </BottomSheet>
  );
});
