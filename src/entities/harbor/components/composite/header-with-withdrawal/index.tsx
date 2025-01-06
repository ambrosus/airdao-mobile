import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Button } from '@components/base';
import { Header } from '@components/composite';
import { WithdrawIcon } from '@components/svg/icons/v2/harbor';
import {
  useHarborStore,
  useStakeHBRStore,
  useStakeUIStore
} from '@entities/harbor/model';

enum TAB_INDEX {
  AMB = 0,
  HBR = 1
}

export const HeaderWithWithdrawal = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();

  const { activeTabIndex } = useStakeUIStore();
  const { loading } = useHarborStore();
  const { loading: hbrLoading, stake, deposit } = useStakeHBRStore();

  const isWithdrawalHbrActive = useMemo(() => {
    return !stake.isZero() || !deposit.isZero();
  }, [deposit, stake]);

  const renderRightContentNode = useMemo(() => {
    if (activeTabIndex === TAB_INDEX.AMB && !loading) {
      const onPress = () =>
        !loading && navigation.navigate('WithdrawHarborScreen');

      return (
        <Button onPress={onPress}>
          <WithdrawIcon />
        </Button>
      );
    }

    if (
      activeTabIndex === TAB_INDEX.HBR &&
      isWithdrawalHbrActive &&
      !hbrLoading
    ) {
      const onPress = () =>
        !loading && navigation.navigate('WithdrawHarborScreen');

      return (
        <Button onPress={onPress}>
          <WithdrawIcon />
        </Button>
      );
    }
  }, [activeTabIndex, hbrLoading, isWithdrawalHbrActive, loading, navigation]);

  return (
    <Header title={t('staking.header')} contentRight={renderRightContentNode} />
  );
};
