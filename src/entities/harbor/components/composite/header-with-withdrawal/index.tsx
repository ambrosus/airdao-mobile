import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Button } from '@components/base';
import { Header } from '@components/composite';
import { WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { useHarborStore, useStakeUIStore } from '@entities/harbor/model';

enum TAB_INDEX {
  ASC = 0,
  HBR = 1
}

export const HeaderWithWithdrawal = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();

  const { activeTabIndex } = useStakeUIStore();
  const { loading } = useHarborStore();

  const renderRightContentNode = useMemo(() => {
    if (activeTabIndex === TAB_INDEX.ASC && !loading) {
      const onPress = () =>
        !loading && navigation.navigate('WithdrawHarborScreen');

      return (
        <Button onPress={onPress}>
          <WithdrawIcon />
        </Button>
      );
    }
  }, [activeTabIndex, loading, navigation]);

  return (
    <Header title={t('staking.header')} contentRight={renderRightContentNode} />
  );
};
