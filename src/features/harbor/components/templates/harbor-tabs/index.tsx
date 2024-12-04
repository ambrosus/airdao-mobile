import React from 'react';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import {
  StakeAMBTab,
  StakeHBRTab
} from '@features/harbor/components/composite';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { TokenLogo } from '@components/modular';

export const HarborTabs = () => {
  return (
    <AnimatedTabsV2
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          icon: <TokenLogo token={'amb'} scale={0.5} />,
          title: 'AMB STAKE',
          view: (
            <WrappedListsContainer>
              <StakeAMBTab />
            </WrappedListsContainer>
          )
        },
        {
          icon: <TokenLogo token={'hbr'} scale={0.6} />,
          title: 'HBR STAKE',
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
