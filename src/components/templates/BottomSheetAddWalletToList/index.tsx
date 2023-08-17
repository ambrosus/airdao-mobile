import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { useFullscreenModalHeight } from '@hooks';
import { COLORS } from '@constants/colors';
import { AddWalletToList, AddWalletToListProps } from '../AddWalletToList';
import { verticalScale } from '@utils/scaling';
import { PrimaryButton } from '@components/modular';
import { BottomSheetCreateRenameGroup } from '@components/templates';
import { useLists } from '@contexts';

interface BottomSheetAddWalletToListProps extends AddWalletToListProps {
  title: string;
}

export const BottomSheetAddWalletToList = forwardRef<
  BottomSheetRef,
  BottomSheetAddWalletToListProps
>((props, ref) => {
  const { title, ...addWalletToListProps } = props;
  const fullscreenHeight = useFullscreenModalHeight();
  const { handleOnCreate, createGroupRef } = useLists((v) => v);

  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  return (
    <BottomSheet
      ref={ref}
      height={fullscreenHeight * 0.95}
      avoidKeyboard={false}
      swiperIconVisible={true}
    >
      <Spacer value={verticalScale(24)} />
      <Text
        fontSize={18}
        fontFamily="Inter_700Bold"
        color={COLORS.jetBlack}
        align="center"
      >
        {title}
      </Text>
      <Spacer value={verticalScale(24)} />
      <AddWalletToList {...addWalletToListProps} />
      <PrimaryButton
        onPress={() => {
          showCreateNewListModal();
        }}
        style={{ width: '90%', alignSelf: 'center' }}
      >
        <Text fontFamily="Inter_600SemiBold" color={COLORS.white} fontSize={16}>
          Create new group
        </Text>
      </PrimaryButton>
      <Spacer value={verticalScale(48)} />
      <BottomSheetCreateRenameGroup
        ref={createGroupRef}
        type="create"
        handleOnCreateGroup={handleOnCreate}
      />
    </BottomSheet>
  );
});
