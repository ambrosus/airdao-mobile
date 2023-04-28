import React from 'react';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { CheckBox } from '@components/composite';
import { COLORS } from '@constants/colors';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';

type Props = {
  isPersonalAddress: boolean;
  onIsPersonalAddressChange: (newFlag: boolean) => unknown;
  handleOnboardingStepChange: (amount: number) => void;
  isActiveToolTip?: boolean;
};

export const EditWalletCheckboxToolTip = (props: Props): JSX.Element => {
  const {
    isPersonalAddress,
    onIsPersonalAddressChange,
    handleOnboardingStepChange,
    isActiveToolTip = false
  } = props;
  const { status, handleSkipTutorial } = useOnboardingStatus((v) => v);
  const {
    title,
    subtitle,
    buttonLeftTitle,
    buttonRightTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);

  return (
    <Tooltip
      tooltipStyle={{ flex: 1 }}
      contentStyle={{ height: 136, borderRadius: 8 }}
      arrowSize={{ width: 16, height: 8 }}
      backgroundColor="rgba(0,0,0,0.5)"
      isVisible={isActiveToolTip}
      content={
        <OnBoardingToolTipBody
          title={title}
          buttonRightTitle={buttonRightTitle}
          subtitle={subtitle}
          buttonLeftTitle={buttonLeftTitle}
          handleButtonRightPress={handleSkipTutorial}
          handleButtonLeftPress={() => handleOnboardingStepChange(-1)}
          isButtonLeftVisible={isButtonLeftVisible}
        />
      }
      placement="bottom"
      onClose={() => null}
    >
      <View
        style={{
          // TODO fix styles of container paddings
          borderWidth: 1,
          borderRadius: 10,
          padding: 7,
          borderColor: 'white'
        }}
      >
        <Button
          onPress={() => {
            onIsPersonalAddressChange(!isPersonalAddress);
            handleOnboardingStepChange(1);
          }}
        >
          <Row alignItems="center">
            <CheckBox
              type="square"
              value={isPersonalAddress}
              fillColor={COLORS.deepBlue}
              color={COLORS.white}
            />
            <Spacer horizontal value={12} />
            <Text title color={COLORS.black} fontFamily="Inter_600SemiBold">
              This is my personal Address
            </Text>
          </Row>
        </Button>
        <Spacer value={12} />
        <Text
          fontWeight="400"
          color="#646464"
          fontSize={12}
          fontFamily="Inter_600SemiBold"
        >
          {'Personal Addresses will be added to “My Addresses” by default'}
        </Text>
      </View>
    </Tooltip>
  );
};
