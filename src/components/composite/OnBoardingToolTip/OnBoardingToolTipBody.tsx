import React from 'react';
import { styles } from '@components/composite/OnBoardingToolTip/styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CloseIcon } from '@components/svg/icons';
import { View } from 'react-native';
import { OnBoardingToolTipInfo } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';

export const OnBoardingToolTipBody = ({
  title,
  buttonLeft,
  isButtonLeftVisible,
  buttonRight,
  subtitle,
  handleButtonRight,
  handleButtonClose
}: Omit<OnBoardingToolTipInfo, 'isButtonClose'> & {
  handleButtonClose?: () => void;
  handleButtonRight?: () => void;
  handleButtonLeft?: () => void;
}) => {
  console.log(
    title,
    buttonLeft,
    isButtonLeftVisible,
    buttonRight,
    subtitle,
    handleButtonRight,
    handleButtonClose
  );
  return (
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
        {!!handleButtonClose && (
          <Button onPress={() => handleButtonClose()}>
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
          <Button style={styles.buttonRight} onPress={handleButtonRight}>
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
  );
};
