import React, { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Text } from '@components/base';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { styles } from '@screens/Wallets/components/styles';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  status: OnBoardingStatus;
  handleOnboardingStepChange: (nextStep: 'back' | 'next') => void;
  children: React.ReactNode;
  isToolTipVisible: boolean;
  onboardingButtonTitle?: string;
  onboardingButtonIcon?: React.ReactNode;
  setIsToolTipVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

export const OnboardingFloatButton = (props: Props): JSX.Element => {
  const {
    status,
    handleOnboardingStepChange,
    children,
    isToolTipVisible,
    onboardingButtonTitle,
    setIsToolTipVisible,
    onboardingButtonIcon
  } = props;

  const bottomSafeArea = useSafeAreaInsets().bottom || 34;

  const {
    title,
    subtitle,
    buttonRightTitle,
    buttonLeftTitle,
    isButtonClose,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);

  const onCloseTooltip = useCallback(() => {
    if (setIsToolTipVisible) {
      setIsToolTipVisible(false);
    }
  }, [setIsToolTipVisible]);

  const content = useMemo(() => {
    return (
      <OnBoardingToolTipBody
        handleButtonClose={isButtonClose ? onCloseTooltip : undefined}
        title={title}
        buttonRightTitle={buttonRightTitle}
        subtitle={subtitle}
        buttonLeftTitle={buttonLeftTitle}
        isButtonLeftVisible={isButtonLeftVisible}
        handleButtonLeftPress={
          status !== 'step-1'
            ? () => handleOnboardingStepChange('back')
            : undefined
        }
        handleButtonRightPress={() => handleOnboardingStepChange('next')}
      />
    );
  }, []);

  return isToolTipVisible ? (
    <View
      style={[
        styles.tooltip,
        { bottom: bottomSafeArea + DEFAULT_BOTTOM_TAB_HEIGHT }
      ]}
    >
      <Tooltip
        tooltipStyle={{ flex: 1 }}
        contentStyle={{ height: 136, borderRadius: 8 }}
        arrowSize={{ width: 16, height: 8 }}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={isToolTipVisible}
        content={content}
        placement="top"
        onClose={() => null}
      >
        <Pressable
          onPress={() => {
            handleOnboardingStepChange('next');
          }}
          style={[
            styles.tooltipButton,
            { borderWidth: 1, borderColor: 'white' }
          ]}
        >
          {onboardingButtonIcon ? onboardingButtonIcon : null}
          <Text style={styles.tooltipButtonText}>{onboardingButtonTitle}</Text>
        </Pressable>
      </Tooltip>
    </View>
  ) : (
    <View>{children}</View>
  );
};
