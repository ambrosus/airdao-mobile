import React, { ForwardedRef, forwardRef, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetFloat } from '@components/modular';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { useLists } from '@contexts';
import { COLORS } from '@constants/colors';
import { AccountList } from '@models';
import { BottomSheetCreateRenameGroup } from '../BottomSheetCreateRenameGroup';
import { styles } from './styles';
import { StringUtils } from '@utils/string';

interface BottomSheetEditCollectionProps extends BottomSheetProps {
  collection: AccountList;
  onRename?: (newName: string) => unknown;
  onDelete?: () => unknown;
}

export const BottomSheetEditCollection = forwardRef<
  BottomSheetRef,
  BottomSheetEditCollectionProps
>((props, ref) => {
  const { collection, onRename, onDelete, ...bottomSheetProps } = props;
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { handleOnRename, handleOnDelete } = useLists((v) => v);
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
    handleOnDelete(collection.id);
    if (typeof onDelete === 'function') onDelete();
  };

  const renameGroup = (listId: string, newName: string) => {
    handleOnRename(listId, newName);
    dismissRename();
    dismissThis();
    if (typeof onRename === 'function') onRename(newName);
  };

  return (
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      avoidKeyboard={false}
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
            color={COLORS.smokyBlack}
          >
            Rename Collection
          </Text>
        </Button>
        <Button
          type="circular"
          style={{
            ...styles.actionBtn,
            backgroundColor: COLORS.pinkRed
          }}
          onPress={deleteCollection}
        >
          <Text color={COLORS.crimsonRed}>
            Delete {StringUtils.formatAddress(collection.name, 10, 0)}
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
    </BottomSheetFloat>
  );
});
