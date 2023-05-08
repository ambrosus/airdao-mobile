import React, { useEffect } from 'react';
import { Button, Row, Text } from '@components/base';
import { OnboardingView } from '@components/templates/OnboardingView';
import { PlusIcon } from '@components/svg/icons';
import { useOnboardingStatus, useLists } from '@contexts';
import { COLORS } from '@constants/colors';
import { styles } from '../styles';

export const EditWalletButtonToolTip = (): JSX.Element => {
  const { createGroupRef } = useLists((v) => v);
  const { status, registerHelpers } = useOnboardingStatus((v) => v);
  const showCreateNewListModal = () => {
    createGroupRef.current?.show();
  };

  // onboarding registration
  useEffect(() => {
    if (status === 7)
      registerHelpers({
        next: () => {
          setTimeout(() => {
            showCreateNewListModal();
          }, 100);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <OnboardingView
      thisStep={7}
      childrenAlwaysVisible
      tooltipPlacement="top"
      contentStyle={{ minHeight: 162 }}
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
