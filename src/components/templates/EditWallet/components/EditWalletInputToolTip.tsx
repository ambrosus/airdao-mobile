import React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { Input } from '@components/base';
import { styles } from '@components/templates/EditWallet/styles';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

type Props = {
  name: string;
  onNameChange: (newName: string) => unknown;
  handleOnboardingStepChange: (amount: number) => void;
  isActiveToolTip?: boolean;
};
export const EditWalletInputToolTip = (props: Props): JSX.Element => {
  const { name, onNameChange, handleOnboardingStepChange, isActiveToolTip } =
    props;
  const { handleSkipTutorial, status } = useOnboardingStatus((v) => v);
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
      contentStyle={{ height: 152, borderRadius: 8 }}
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
      <Input
        onBlur={() => {
          handleOnboardingStepChange(1);
        }}
        placeholder="Placeholder"
        style={styles.input}
        value={name}
        onChangeValue={onNameChange}
      />
    </Tooltip>
  );
};
