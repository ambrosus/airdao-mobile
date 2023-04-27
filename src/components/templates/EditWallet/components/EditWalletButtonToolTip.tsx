import React from 'react';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { Button, Row, Text } from '@components/base';
import { styles } from '@components/templates/EditWallet/styles';
import { PlusIcon } from '@components/svg/icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { useLists } from '@contexts/ListsContext';

type Props = {
  handleOnboardingStepChange: (amount: number) => void;
  isActiveToolTip?: boolean;
};

export const EditWalletButtonToolTip = (props: Props): JSX.Element => {
  const { isActiveToolTip = false, handleOnboardingStepChange } = props;
  const { status, handleSkipTutorial } = useOnboardingStatus((v) => v);
  const {
    title,
    subtitle,
    buttonLeftTitle,
    buttonRightTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);
  const { createGroupRef } = useLists((v) => v);

  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

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
      placement="top"
      onClose={() => null}
    >
      <Button
        type="circular"
        style={styles.newListButton}
        onPress={() => {
          showCreateNewListModal();
          handleOnboardingStepChange(1);
        }}
      >
        <Row alignItems="center">
          <PlusIcon color="#000000" />
          <Text title fontFamily="Inter_600SemiBold">
            Create new list
          </Text>
        </Row>
      </Button>
    </Tooltip>
  );
};
