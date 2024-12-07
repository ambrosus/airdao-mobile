import React from 'react';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import {
  StakeAMBTab,
  StakeHBRTab
} from '@features/harbor/components/composite';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { TokenLogo } from '@components/modular';
import { useTranslation } from 'react-i18next';

export const HarborTabs = () => {
  const { t } = useTranslation();
  return (
    <AnimatedTabsV2
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          icon: <TokenLogo token={'amb'} scale={0.5} />,
          title: `${t('staking.header')} AMB`,
          view: (
            <WrappedListsContainer>
              <StakeAMBTab />
            </WrappedListsContainer>
          )
        },
        {
          icon: <TokenLogo token={'hbr'} scale={0.6} />,
          title: `${t('staking.header')} HBR`,
          view: (
            <WrappedListsContainer>
              <StakeHBRTab />
            </WrappedListsContainer>
          )
        }
      ]}
    />
  );
};
