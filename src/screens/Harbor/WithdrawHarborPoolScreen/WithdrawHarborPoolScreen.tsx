import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Header } from '@components/composite';
import { WithdrawalHbrYieldInput } from '@entities/harbor/components/modular';
import { styles } from './styles';

type Props = NativeStackScreenProps<
  HarborTabParamsList,
  'WithdrawHarborPoolScreen'
>;

export const WithdrawHarborPoolScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const {
    params: { token, logs }
  } = route;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`${t('harbor.withdraw.header')} AMB`} />

      <View style={styles.innerContainer}>
        <WithdrawalHbrYieldInput
          token={token}
          type={logs?.status ?? 'error'}
          logs={logs}
        />
      </View>
    </SafeAreaView>
  );
};
