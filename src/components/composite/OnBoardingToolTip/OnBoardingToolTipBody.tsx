import React from 'react';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { OnBoardingToolTipInfo } from './OnBoardingToolTip.types';
import { styles } from './styles';

export const OnBoardingToolTipBody = ({
  title,
  buttonLeftTitle,
  isButtonLeftVisible,
  buttonRightTitle,
  subtitle,
  handleButtonRightPress,
  handleButtonLeftPress,
  handleButtonClose
}: Omit<OnBoardingToolTipInfo, 'isButtonClose'> & {
  handleButtonClose?: () => void | null;
  handleButtonRightPress?: () => void;
  handleButtonLeftPress?: () => unknown;
}) => {
  return (
    <View style={styles.content}>
      <Row justifyContent="space-between">
        <Text
          fontFamily="Inter_500Medium"
          fontSize={12}
          color={COLORS.smokyBlack}
          style={styles.title}
        >
          {title}
        </Text>
        {!!handleButtonClose ? (
          <Button onPress={handleButtonClose} testID="onboarding-close-button">
            <CloseIcon />
          </Button>
        ) : null}
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
          {isButtonLeftVisible ? (
            <Button style={styles.buttonLeft} onPress={handleButtonLeftPress}>
              <Text
                fontFamily="Inter_500Medium"
                fontSize={14}
                color={COLORS.smokyBlack}
                style={styles.buttonText}
              >
                {buttonLeftTitle}
              </Text>
            </Button>
          ) : null}
          <Button style={styles.buttonRight} onPress={handleButtonRightPress}>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={14}
              color={COLORS.deepBlue}
              style={styles.buttonText}
            >
              {buttonRightTitle}
            </Text>
          </Button>
        </Row>
      </View>
    </View>
  );
};
