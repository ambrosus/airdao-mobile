import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useState
} from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { styles } from '@components/templates/BottomSheetCreateRenameGroup/styles';
import { Toast, ToastType } from '@components/modular';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRenameGroup?: (selectedListId: string, newListName: string) => void;
  handleOnCreateGroup?: (value: string) => void;
  groupTitle?: string;
  groupId?: string;
  type: 'rename' | 'create';
};
export const BottomSheetCreateRenameGroup = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const {
      handleOnRenameGroup,
      groupTitle,
      type = 'create',
      handleOnCreateGroup,
      groupId
    } = props;
    const [localGroupName, setLocalGroupName] = useState<string>(
      groupTitle || ''
    );
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const handleButtonPress = useCallback(() => {
      if (handleOnCreateGroup) {
        handleOnCreateGroup(localGroupName);
        Toast.show({
          message: `Way to go! ${localGroupName} list created.`,
          type: ToastType.Top
        });
      }
      if (handleOnRenameGroup && groupId) {
        handleOnRenameGroup(groupId, localGroupName);
        localRef.current?.dismiss();
        Toast.show({
          message: `${groupTitle} has been renamed to ${localGroupName}.`,
          type: ToastType.Top
        });
      }
      setLocalGroupName('');
    }, [
      groupId,
      groupTitle,
      handleOnCreateGroup,
      handleOnRenameGroup,
      localGroupName,
      localRef
    ]);

    return (
      <>
        <BottomSheet height={400} ref={localRef}>
          <View style={styles.icon}>
            <BottomSheetSwiperIcon />
          </View>
          <Spacer value={29} />
          <View style={styles.newListTitle}>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={20}
              color={COLORS.black}
            >
              {type === 'create' ? ' Create new List' : 'Rename List'}
            </Text>
          </View>
          <Spacer value={36} />
          <View style={styles.bottomSheetSubtitle}>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.dark}
            >
              List name
            </Text>
          </View>
          <Input
            value={localGroupName}
            onChangeValue={(value) => setLocalGroupName(value)}
            type="text"
            placeholder="Enter list name"
            placeholderTextColor="black"
            style={[styles.bottomSheetInput]}
          />
          <Spacer value={32} />
          <Button
            disabled={!localGroupName.length}
            type="base"
            style={styles.bottomSheetCreateRenameButton}
            onPress={handleButtonPress}
          >
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.white}
            >
              {type === 'create' ? 'Create' : 'Rename'}
            </Text>
          </Button>
          <Spacer value={24} />
          <Button
            type="base"
            style={styles.bottomSheetCancelButton}
            onPress={() => localRef.current?.dismiss()}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              color={COLORS.buttonTextColor}
              fontSize={16}
            >
              Cancel
            </Text>
          </Button>
        </BottomSheet>
      </>
    );
  }
);
