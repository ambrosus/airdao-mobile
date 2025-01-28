import { useTranslation } from 'react-i18next';
import { WrappedListsContainer } from '@components/base/wrapped-lists-container';
import { TokenLogo } from '@components/modular';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { useStakeUIStore } from '@entities/harbor';
import { StakeAMBTab } from '../stake-amb-tab';
import { StakeHBRTab } from '../stake-hbr-tab';

export const HarborStakeTabs = () => {
  const { t } = useTranslation();
  const { setActiveTabIndex } = useStakeUIStore();

  return (
    <AnimatedTabsV2
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      containerStyle={{ height: '100%' }}
      onChangeActiveIndex={setActiveTabIndex}
      tabs={[
        {
          icon: <TokenLogo token={'amb'} scale={0.7} />,
          title: `${t('staking.header')} AMB`,
          view: (
            <WrappedListsContainer>
              <StakeAMBTab />
            </WrappedListsContainer>
          )
        },
        {
          icon: <TokenLogo token={'hbr'} scale={0.8} />,
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
