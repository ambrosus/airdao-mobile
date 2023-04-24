import React, { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Text } from '@components/base';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { styles } from '@screens/Wallets/components/styles';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  status: OnBoardingStatus;
  handleStepChange: (nextStep: OnBoardingStatus) => void;
  children: React.ReactNode;
  isToolTipVisible: boolean;
  FloatButtonTitle?: string;
  isIconVisible?: boolean;
};

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

export const OnboardingFloatButton = (props: Props): JSX.Element => {
  const {
    status,
    handleStepChange,
    children,
    isToolTipVisible,
    FloatButtonTitle,
    isIconVisible
  } = props;

  // useEffect(() => {
  //   setTimeout(() => setToolTipVisible(true), 300);
  // }, []);

  const bottomSafeArea = useSafeAreaInsets().bottom || 34;

  const {
    title,
    subtitle,
    buttonRight,
    buttonLeft,
    isButtonLeftVisible,
    isButtonClose
  } = useOnboardingToolTip(status);

  const handleNextButtonPress = useCallback(() => {
    console.log(123);
  }, []);

  const onCloseTooltip = useCallback(() => {
    // isToolTipVisible(false);
  }, []);

  const handleOnAddressButtonPress = () => {
    if (isToolTipVisible) {
      handleNextButtonPress();
    }
    // setToolTipVisible(!isToolTipVisible);
  };

  const content = useMemo(() => {
    return (
      <OnBoardingToolTipBody
        handleButtonClose={onCloseTooltip}
        title={title}
        buttonRight={buttonRight}
        subtitle={subtitle}
        buttonLeft={buttonLeft}
        handleButtonRight={handleNextButtonPress}
        isButtonLeftVisible={isButtonLeftVisible}
      />
    );
  }, []);

  return (
    <View
      style={[
        styles.tooltip,
        { bottom: bottomSafeArea + DEFAULT_BOTTOM_TAB_HEIGHT }
      ]}
    >
      <Tooltip
        arrowSize={{ width: 16, height: 8 }}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={isToolTipVisible}
        content={content}
        placement="top"
        onClose={() => null}
      >
        <Pressable
          onPress={() => handleStepChange('step-2')}
          style={[
            styles.tooltipButton,
            { borderWidth: 1, borderColor: 'white' }
          ]}
        >
          {isIconVisible ? <AddIcon /> : null}
          <Text style={styles.tooltipButtonText}>{FloatButtonTitle}</Text>
        </Pressable>
      </Tooltip>
    </View>
  );
  // : (
  //     <View>{children}</View>
  //   );
};
