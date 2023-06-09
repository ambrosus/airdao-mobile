import React from 'react';
import { Button, Row, Text } from '@components/base';
import { OnboardingView } from '@components/templates/OnboardingView';
import { PlusIcon } from '@components/svg/icons';
import { useLists } from '@contexts';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';

export const EditWalletButtonToolTip = (): JSX.Element => {
  const { createGroupRef } = useLists((v) => v);
  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  return (
    <OnboardingView
      thisStep={7}
      childrenAlwaysVisible
      tooltipPlacement="top"
      helpers={{
        next: () => {
          setTimeout(() => {
            showCreateNewListModal();
          }, 100);
        }
      }}
    >
      <Button
        type="circular"
        style={styles.newListButton}
        onPress={() => {
          showCreateNewListModal();
        }}
      >
        <Row alignItems="center">
          <PlusIcon color={COLORS.deepBlue} />
          <Text
            style={{ left: 10.5 }}
            title
            fontFamily="Inter_600SemiBold"
            color={COLORS.deepBlue}
          >
            Create new list
          </Text>
        </Row>
      </Button>
    </OnboardingView>
  );
};
