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
import { COLORS } from '@constants/colors';

interface BottomSheetWithHeaderProps extends BottomSheetProps {
  title: string;
  actionTitle?: string;
  onActionPress?: () => unknown;
  status?: OnBoardingStatus;
  isToolTipVisible?: boolean;
  handleOnboardingStepChange?: (nextStep: 'back' | 'next') => void;
}

export const BottomSheetWithHeader = forwardRef<
  BottomSheetRef,
  BottomSheetWithHeaderProps
>((props, ref) => {
  const { handleSkipTutorial, status } = useOnboardingStatus((v) => v);
  const {
    title: toolTipTitle,
    subtitle,
    buttonRightTitle,
    buttonLeftTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);
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

  const renderContentRight = () => {
    if (actionTitle) {
      return (
        <Tooltip
          tooltipStyle={{ top: 35 }}
          contentStyle={{ height: 130, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          arrowStyle={{ flex: 1, position: 'relative', top: 35 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={isToolTipVisible}
          content={
            <OnBoardingToolTipBody
              title={toolTipTitle}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonRightPress={handleSkipTutorial}
              handleButtonLeftPress={() =>
                handleOnboardingStepChange && handleOnboardingStepChange('back')
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
                }, 1000);
              }
              if (onActionPress) onActionPress();
            }}
          >
            <Text color={isToolTipVisible ? COLORS.white : COLORS.jungleGreen}>
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
