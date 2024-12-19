import React from 'react';
import { useTranslation } from 'react-i18next';
import { TokenLogo } from '@components/modular';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import { StakeAMBTab } from '../stake-amb-tab';

export const HarborStakeTabs = () => {
  const { t } = useTranslation();
  return (
    <AnimatedTabsV2
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          icon: <TokenLogo token={'amb'} scale={0.7} />,
          title: `${t('staking.header')} AMB`,
          view: (
            <WrappedListsContainer>
              <StakeAMBTab />
            </WrappedListsContainer>
          )
        }
        // {
        //   icon: <TokenLogo token={'hbr'} scale={0.8} />,
        //   title: `${t('staking.header')} HBR`,
        //   view: (
        //     <WrappedListsContainer>
        //       <StakeHBRTab />
        //     </WrappedListsContainer>
        //   )
        // }
      ]}
    />
  );
};
