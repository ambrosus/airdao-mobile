import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, InputRef, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheet } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { BottomSheetSwiperIcon } from '@components/svg/icons';
import { styles } from '@components/templates/BottomSheetCreateRenameGroup/styles';
import { Toast, ToastType } from '@components/modular';
import { OnboardingView } from '../OnboardingView';

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

    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const nameInput = useRef<InputRef>(null);
    const [localGroupName, setLocalGroupName] = useState<string>(
      groupTitle || ''
    );

    // onboarding functions
    const setDemoName = () => {
      nameInput.current?.setText('Demo group');
      setLocalGroupName('Demo Group');
    };

    // end of onboarding functions

    const handleButtonPress = useCallback(() => {
      if (handleOnCreateGroup) {
        handleOnCreateGroup(localGroupName);
        localRef.current?.dismiss();
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
        <BottomSheet height={500} ref={localRef}>
          <View testID="BottomSheetCreateRename" style={styles.container}>
            <View style={styles.content}>
              <View style={styles.icon}>
                <BottomSheetSwiperIcon />
              </View>
              <Spacer value={29} />
              <Text
                testID="BottomSheetCreateRename_Title"
                style={styles.newListTitle}
                fontFamily="Inter_600SemiBold"
                fontSize={20}
                color={COLORS.smokyBlack}
              >
                {type === 'create' ? ' Create new List' : 'Rename List'}
              </Text>
              <Spacer value={36} />
              <Text
                fontFamily="Inter_500Medium"
                fontSize={16}
                color={COLORS.oil}
              >
                List name
              </Text>
              <OnboardingView
                thisStep={8}
                tooltipPlacement="bottom"
                childrenAlwaysVisible
                helpers={{ next: setDemoName, back: localRef.current?.dismiss }}
              >
                <Input
                  testID="BottomSheetCreateRename_Input"
                  ref={nameInput}
                  value={localGroupName}
                  onChangeValue={setLocalGroupName}
                  type="text"
                  placeholder="Enter list name"
                  placeholderTextColor="black"
                  style={[styles.bottomSheetInput]}
                />
              </OnboardingView>
              <Spacer value={32} />
              <OnboardingView
                thisStep={9}
                tooltipPlacement="bottom"
                childrenAlwaysVisible
                helpers={{ next: handleButtonPress }}
              >
                <Button
                  testID="BottomSheetCreateRename_Button"
                  disabled={!localGroupName.length}
                  type="circular"
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
              </OnboardingView>
              <Spacer value={24} />
              <Button
                testID="BottomSheetCreateRename_Cancel_Button"
                type="base"
                style={styles.bottomSheetCancelButton}
                onPress={() => localRef.current?.dismiss()}
              >
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.midnight}
                  fontSize={16}
                >
                  Cancel
                </Text>
              </Button>
            </View>
          </View>
        </BottomSheet>
      </>
    );
  }
);
