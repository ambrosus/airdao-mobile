import React, { forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { Button, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import Tooltip from 'react-native-walkthrough-tooltip';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

interface BottomSheetWithHeaderProps extends BottomSheetProps {
  title: string;
  actionTitle?: string;
  onActionPress?: () => unknown;
  status?: OnBoardingStatus;
  isToolTipVisible?: boolean;
  setIsToolTipVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnboardingStepChange?: (nextStep: 'back' | 'next') => void;
}

export const BottomSheetWithHeader = forwardRef<
  BottomSheetRef,
  BottomSheetWithHeaderProps
>((props, ref) => {
  const { handleSkipTutorial, status } = useOnboardingStatus((v) => v);
  const { subtitle, buttonRightTitle, buttonLeftTitle, isButtonLeftVisible } =
    useOnboardingToolTip(status);
  const {
    title,
    actionTitle,
    onActionPress,
    children,
    isToolTipVisible,
    handleOnboardingStepChange,
    ...bottomSheetProps
  } = props;

  const localRef = useForwardedRef<BottomSheetRef>(ref);

  const dismiss = () => {
    localRef.current?.dismiss();
  };

  console.log(onActionPress);

  const renderContentRight = () => {
    if (actionTitle) {
      return (
        <Tooltip
          tooltipStyle={{ top: 35 }}
          contentStyle={{ height: 146, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          arrowStyle={{ flex: 1, position: 'relative', top: 35 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={isToolTipVisible}
          content={
            <OnBoardingToolTipBody
              title="Save changes"
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonRightPress={handleSkipTutorial}
              handleButtonLeftPress={() =>
                handleOnboardingStepChange
                  ? handleOnboardingStepChange('back')
                  : console.log('prev step')
              }
              isButtonLeftVisible={isButtonLeftVisible}
            />
          }
          placement="left"
          onClose={() => null}
        >
          <Button
            onPress={() => {
              if (status === 'step-10' && onActionPress) {
                return setTimeout(() => {
                  onActionPress();
                }, 400);
              }
              if (onActionPress) onActionPress();
            }}
          >
            <Text color="#2F2B43" opacity={0.5}>
              {actionTitle}
            </Text>
          </Button>
        </Tooltip>
      );
    }
  };

  return (
    <BottomSheet ref={localRef} {...bottomSheetProps}>
      <>
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button onPress={dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={renderContentRight()}
          title={title}
        />
        {children}
      </>
    </BottomSheet>
  );
});
