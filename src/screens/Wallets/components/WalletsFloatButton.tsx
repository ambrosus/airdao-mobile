import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Text } from '@components/base';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { FloatButton } from '@components/base/FloatButton';
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
};

const DEFAULT_BOTTOM_TAB_HEIGHT = 65;

export const WalletsFloatButton = ({ status, handleStepChange }: Props) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setToolTipVisible(true), 300);
  }, []);

  const bottomSafeArea = useSafeAreaInsets().bottom || 34;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    title,
    subtitle,
    buttonRight,
    buttonLeft,
    isButtonLeftVisible,
    isButtonClose
  } = useOnboardingToolTip(status);

  const handleNextButtonPress = useCallback(() => {
    handleStepChange('step-2');
    setTimeout(() => {
      navigation.navigate('Explore');
    }, 0);
  }, [handleStepChange, navigation]);

  const onCloseTooltip = () => {
    if (isButtonClose) {
      setToolTipVisible(false);
    }
  };

  const handleOnAddressButtonPress = () => {
    setToolTipVisible(!toolTipVisible);
    if (toolTipVisible) {
      handleNextButtonPress();
    }
  };

  return status === 'step-1' ? (
    <View
      style={[
        styles.tooltip,
        { bottom: bottomSafeArea + DEFAULT_BOTTOM_TAB_HEIGHT }
      ]}
    >
      <Tooltip
        arrowSize={{ width: 16, height: 8 }}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={toolTipVisible}
        content={
          <OnBoardingToolTipBody
            handleButtonClose={onCloseTooltip}
            title={title}
            buttonRight={buttonRight}
            subtitle={subtitle}
            buttonLeft={buttonLeft}
            handleButtonRight={handleNextButtonPress}
            isButtonLeftVisible={isButtonLeftVisible}
          />
        }
        placement="top"
        onClose={() => null}
      >
        <Pressable
          onPress={handleOnAddressButtonPress}
          style={[
            styles.tooltipButton,
            toolTipVisible && { borderWidth: 1, borderColor: 'white' }
          ]}
        >
          <AddIcon />
          <Text style={styles.tooltipButtonText}>Add a Address</Text>
        </Pressable>
      </Tooltip>
    </View>
  ) : (
    <FloatButton
      title="Add a Address"
      onPress={() => navigation.navigate('Explore')}
      icon={<AddIcon />}
    />
  );
};
