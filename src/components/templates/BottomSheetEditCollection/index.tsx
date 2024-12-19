import React, { ForwardedRef, forwardRef, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useListActions } from '@features/lists';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { AccountList } from '@models';
import { StringUtils, verticalScale } from '@utils';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';

interface BottomSheetEditCollectionProps extends BottomSheetProps {
  collection: AccountList;
  onRename?: (newName: string) => unknown;
  onDelete?: () => unknown;
}

export const BottomSheetEditCollection = forwardRef<
  BottomSheetRef,
  BottomSheetEditCollectionProps
>(({ collection, onRename, onDelete, ...bottomSheetProps }, ref) => {
  const { t } = useTranslation();
  const { onRenameList, onDeleteList } = useListActions();

  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const renameCollectionModalRef = useRef<BottomSheetRef>(null);

  const dismissThis = useCallback(() => {
    setTimeout(() => {
      localRef.current?.dismiss();
    }, 800);
  }, [localRef]);

  const showRename = useCallback(() => {
    renameCollectionModalRef.current?.show();
  }, [renameCollectionModalRef]);

  const dismissRename = useCallback(() => {
    setTimeout(() => {
      renameCollectionModalRef.current?.dismiss();
    }, 400);
  }, [renameCollectionModalRef]);

  const deleteCollection = () => {
    dismissThis();
    onDeleteList(collection.id);
    if (typeof onDelete === 'function') onDelete();
  };

  const renameGroup = (listId: string, newName: string) => {
    onRenameList(listId, newName);
    dismissRename();
    dismissThis();
    if (typeof onRename === 'function') onRename(newName);
  };

  return (
    <BottomSheet
      ref={localRef}
      swiperIconVisible
      avoidKeyboard={false}
      containerStyle={{ minHeight: verticalScale(194) }}
      {...bottomSheetProps}
    >
      <View style={styles.content} testID="bottom-sheet-edit-collection">
        <Button
          type="circular"
          onPress={showRename}
          style={styles.actionBtn}
          testID="Rename_Collection_Button"
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
          >
            {t('collection.rename')}
          </Text>
        </Button>
        <Button
          type="circular"
          style={{
            ...styles.actionBtn,
            backgroundColor: COLORS.error100
          }}
          onPress={deleteCollection}
        >
          <Text
            color={COLORS.error400}
            fontSize={16}
            fontFamily="Inter_600SemiBold"
          >
            {t('button.delete')}{' '}
            {StringUtils.formatAddress(collection.name, 24, 0)}
          </Text>
        </Button>
      </View>

      <BottomSheetCreateRenameGroup
        type="rename"
        groupId={collection.id}
        groupTitle={collection.name}
        handleOnRenameGroup={renameGroup}
        ref={renameCollectionModalRef}
      />
    </BottomSheet>
  );
});
