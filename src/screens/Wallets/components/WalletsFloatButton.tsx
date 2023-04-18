import React, { useState } from 'react';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Button, Row, Spacer, Text } from '@components/base';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { FloatButton } from '@components/base/FloatButton';
import { OnBoardingStatus } from '@components/composite/PopUpOnBoarding/PopUpOnBoarding.types';
import { useOnboardingPopUp } from '@hooks/useOnBoardingPopUp';
import { styles } from '@components/composite/PopUpOnBoarding/styles';
import { CloseIcon } from '@components/svg/icons';

type Props = {
  status: OnBoardingStatus;
};
const WalletsFloatButton = ({ status }: Props) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const {
    title,
    isButtonClose,
    buttonLeft,
    isButtonLeftVisible,
    buttonRight,
    subtitle
  } = useOnboardingPopUp(status);

  return status !== 'none' ? (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: COLORS.grey,
        borderRadius: 24,
        paddingHorizontal: 109,
        bottom: 100
      }}
    >
      <Tooltip
        arrowSize={{ width: 16, height: 8 }}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={toolTipVisible}
        content={
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
                <Button style={styles.buttonRight} onPress={() => null}>
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
        }
        placement="top"
        onClose={() => null}
      >
        <Button
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => {
            setToolTipVisible(!toolTipVisible);
          }}
        >
          <AddIcon />
          <Text
            style={{
              justifyContent: 'center',
              fontFamily: 'Inter_500Medium',
              fontSize: 16,
              paddingVertical: 16,
              paddingLeft: 5,
              color: COLORS.white
            }}
          >
            Add a Address
          </Text>
        </Button>
      </Tooltip>
    </View>
  ) : (
    <FloatButton title="123" onPress={() => null} icon={<AddIcon />} />
  );
};

export default WalletsFloatButton;
