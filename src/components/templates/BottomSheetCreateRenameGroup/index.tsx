import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { Platform, View } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          type: ToastType.Top,
          title: ''
        });
      }
      if (handleOnRenameGroup && groupId) {
        handleOnRenameGroup(groupId, localGroupName);
        localRef.current?.dismiss();
        Toast.show({
          message: `${groupTitle} has been renamed to ${localGroupName}.`,
          type: ToastType.Top,
          title: ''
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

    const bottomSafeArea = useSafeAreaInsets().bottom - 10;

    return (
      <>
        <BottomSheet
          height={350}
          ref={localRef}
          containerStyle={
            Platform.OS === 'android' && { marginBottom: bottomSafeArea }
          }
        >
          <View testID="BottomSheetCreateRename" style={styles.container}>
            <View style={styles.content}>
              <View style={styles.icon}>
                <BottomSheetSwiperIcon />
              </View>
              <Spacer value={24} />
              <Text
                testID="BottomSheetCreateRename_Title"
                style={styles.newListTitle}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.smokyBlack}
              >
                {type === 'create' ? ' Create Collection' : 'Rename Collection'}
              </Text>
              <Spacer value={8} />
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
                  placeholder="Enter collection name"
                  placeholderTextColor="black"
                  style={[styles.bottomSheetInput]}
                />
              </OnboardingView>
              <Spacer value={24} />
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
                    fontFamily="Inter_600SemiBold"
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
                  color={COLORS.nero}
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
