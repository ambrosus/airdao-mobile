import React from 'react';
import { View } from 'react-native';
import Popover from 'react-native-popover-view';
import { Button, Row, Spacer, Text } from '@components/base';
import { styles } from './styles';
import { useOnboardingPopUp } from '@hooks/useOnBoardingPopUp';
import { OnBoardingStatus } from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';
import { COLORS } from '@constants/colors';
import { CloseIcon } from '@components/svg/icons';

export const PopUpOnBoarding = ({
  step,
  handleStepChange
}: {
  step: OnBoardingStatus;
  handleStepChange: (step: OnBoardingStatus | '') => void;
}) => {
  const {
    title,
    isButtonClose,
    subtitle,
    buttonRight,
    isButtonLeftVisible,
    buttonLeft
  } = useOnboardingPopUp(step);

  if (!title) {
    return null;
  }

  return (
    <View style={styles.popup}>
      <Popover isVisible={true} popoverStyle={styles.popover}>
        <View style={styles.content}>
          <Row justifyContent="space-between">
            <Text
              fontFamily="Inter_500Medium"
              fontSize={12}
              color={COLORS.black}
              style={styles.title}
            >
              {title}
            </Text>
            {isButtonClose && (
              <Button>
                <CloseIcon />
              </Button>
            )}
          </Row>
          <Spacer value={4} />
          <Text
            fontFamily="Inter_400Regular"
            fontSize={12}
            color={COLORS.grey}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
          <Spacer value={12} />
          <View style={{ alignItems: 'flex-end' }}>
            <Row
              justifyContent="space-between"
              width={isButtonLeftVisible ? '100%' : undefined}
            >
              {isButtonLeftVisible && (
                <Button style={styles.buttonLeft}>
                  <Text
                    fontFamily="Inter_500Medium"
                    fontSize={14}
                    color={COLORS.black}
                    style={styles.buttonText}
                  >
                    {buttonLeft}
                  </Text>
                </Button>
              )}
              <Button
                style={styles.buttonRight}
                onPress={() => {
                  handleStepChange('step-4');
                }}
              >
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={14}
                  color={COLORS.black}
                  style={styles.buttonText}
                >
                  {buttonRight}
                </Text>
              </Button>
            </Row>
          </View>
        </View>
      </Popover>
    </View>
  );
};
