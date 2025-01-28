import { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { Header } from '@components/composite';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { ILogs } from '@entities/harbor/model/types';
import { useWalletStore } from '@entities/wallet';
import { useEffectOnce } from '@hooks';
import { RequestItem } from '@screens/Harbor/WithdrawRequests/components';
import { styles } from './WithdrawRequests.style';

export const WithdrawRequests = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const insets = useSafeAreaInsets();

  const {
    updateWithdrawList,
    withdrawalList,
    withdrawListLoader,
    clearWithdrawList
  } = useHarborStore();

  const isEmptyList = !withdrawalList.length;

  useEffectOnce(
    useCallback(() => {
      updateWithdrawList(wallet?.address || '');
    }, [updateWithdrawList, wallet?.address])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearWithdrawList();
      };
    }, [clearWithdrawList])
  );

  const renderItem = (item: ListRenderItemInfo<ILogs>) => {
    const { item: requestItem } = item;

    return <RequestItem requestItem={requestItem} />;
  };

  const EmptyList = () => {
    return (
      <View style={styles.emptyList}>
        {!withdrawListLoader && <Text>{t('common.no.transactions')}</Text>}
      </View>
    );
  };

  return (
    <View style={[styles.main, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Header title={t('harbor.requests.header')} />
        <FlatList
          style={styles.main}
          data={withdrawalList}
          contentContainerStyle={isEmptyList ? {} : styles.listContainer}
          renderItem={renderItem}
          ListEmptyComponent={EmptyList}
          refreshControl={
            <RefreshControl
              onRefresh={() => updateWithdrawList(wallet?.address || '')}
              refreshing={withdrawListLoader}
            />
          }
        />
      </View>
    </View>
  );
};
