import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
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
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import Tooltip from 'react-native-walkthrough-tooltip';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRenameGroup?: (selectedListId: string, newListName: string) => void;
  handleOnCreateGroup?: (value: string) => void;
  groupTitle?: string;
  groupId?: string;
  type: 'rename' | 'create';
  handleSaveTooltipVisible?: () => void;
};
export const BottomSheetCreateRenameGroup = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const {
      handleOnRenameGroup,
      groupTitle,
      type = 'create',
      handleOnCreateGroup,
      groupId,
      handleSaveTooltipVisible
    } = props;

    const { status, handleStepChange, handleSkipTutorial } =
      useOnboardingStatus((v) => v);
    const [activeToolTip, setActiveToolTip] = useState<
      'input' | 'button' | null
    >(null);

    const {
      title,
      subtitle,
      buttonRightTitle,
      buttonLeftTitle,
      isButtonLeftVisible
    } = useOnboardingToolTip(status);

    const currentTooltip = useCallback((status: OnBoardingStatus) => {
      return status === 'step-8'
        ? 'input'
        : status === 'step-9'
        ? 'button'
        : null;
    }, []);

    useEffect(() => {
      setTimeout(() => setActiveToolTip(currentTooltip(status)), 500);
    }, [currentTooltip, status]);

    const handleOnboardingStepChange = () => {
      const nextStep = 'step-' + (parseInt(status.slice(-1), 10) + 1);
      handleStepChange(nextStep);
      setActiveToolTip(currentTooltip(nextStep));
      if (nextStep === 'step-10' && handleSaveTooltipVisible) {
        console.log(123);
        handleSaveTooltipVisible();
      }
    };

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
        localRef.current?.dismiss();
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
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.icon}>
                <BottomSheetSwiperIcon />
              </View>
              <Spacer value={29} />
              <Text
                style={styles.newListTitle}
                fontFamily="Inter_600SemiBold"
                fontSize={20}
                color={COLORS.black}
              >
                {type === 'create' ? ' Create new List' : 'Rename List'}
              </Text>
              <Spacer value={36} />
              <Text
                fontFamily="Inter_500Medium"
                fontSize={16}
                color={COLORS.dark}
              >
                List name
              </Text>
              <Tooltip
                tooltipStyle={{ flex: 1 }}
                contentStyle={{ height: 152, borderRadius: 8 }}
                arrowSize={{ width: 16, height: 8 }}
                backgroundColor="rgba(0,0,0,0.5)"
                isVisible={activeToolTip === 'input'}
                content={
                  <OnBoardingToolTipBody
                    title={title}
                    buttonRightTitle={buttonRightTitle}
                    subtitle={subtitle}
                    buttonLeftTitle={buttonLeftTitle}
                    handleButtonRightPress={handleSkipTutorial}
                    handleButtonLeftPress={handleOnboardingStepChange}
                    isButtonLeftVisible={isButtonLeftVisible}
                  />
                }
                placement="bottom"
                onClose={() => null}
              >
                <Input
                  onBlur={() => {
                    setActiveToolTip('button');
                    handleOnboardingStepChange();
                  }}
                  value={localGroupName}
                  onChangeValue={(value) => setLocalGroupName(value)}
                  type="text"
                  placeholder="Enter list name"
                  placeholderTextColor="black"
                  style={[styles.bottomSheetInput]}
                />
              </Tooltip>
              <Spacer value={32} />
              <Tooltip
                tooltipStyle={{ flex: 1 }}
                contentStyle={{ height: 108, borderRadius: 8 }}
                arrowSize={{ width: 16, height: 8 }}
                backgroundColor="rgba(0,0,0,0.5)"
                isVisible={activeToolTip === 'button'}
                content={
                  <OnBoardingToolTipBody
                    title={title}
                    buttonRightTitle={buttonRightTitle}
                    subtitle={subtitle}
                    buttonLeftTitle={buttonLeftTitle}
                    handleButtonRightPress={handleSkipTutorial}
                    handleButtonLeftPress={handleOnboardingStepChange}
                    isButtonLeftVisible={isButtonLeftVisible}
                  />
                }
                placement="bottom"
                onClose={() => null}
              >
                <Button
                  disabled={!localGroupName.length}
                  type="circular"
                  style={styles.bottomSheetCreateRenameButton}
                  onPress={() => {
                    handleButtonPress();
                    handleOnboardingStepChange();
                  }}
                >
                  <Text
                    fontFamily="Inter_500Medium"
                    fontSize={16}
                    color={COLORS.white}
                  >
                    {type === 'create' ? 'Create' : 'Rename'}
                  </Text>
                </Button>
              </Tooltip>
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
            </View>
          </View>
        </BottomSheet>
      </>
    );
  }
);
