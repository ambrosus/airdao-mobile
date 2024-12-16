import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  View
} from 'react-native';
import { formatEther } from 'ethers/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { useWalletStore } from '@entities/wallet';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { ILogs } from '@entities/harbor/model/types';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { TokenLogo } from '@components/modular';
import { CryptoCurrencyCode } from '@appTypes';
import { scale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { styles } from './WithdrawRequests.style';
import { useEffectOnce } from '@hooks';

export const WithdrawRequests = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const insets = useSafeAreaInsets();

  const { updateWithdrawList, withdrawalList, withdrawListLoader } =
    useHarborStore();

  const isEmptyList = !withdrawalList.length;

  useEffectOnce(
    useCallback(() => {
      updateWithdrawList(wallet?.address || '');
    }, [updateWithdrawList, wallet?.address])
  );

  const renderItem = (item: ListRenderItemInfo<ILogs>) => {
    const { item: requestItem } = item;

    const amount = NumberUtils.numberToTransformedLocale(
      NumberUtils.limitDecimalCount(+formatEther(requestItem.amount), 2)
    );

    const isSuccess = requestItem.status.toLowerCase() === 'success';
    return (
      <>
        <View style={styles.listMain}>
          <Row alignItems="center" justifyContent="space-between">
            <Row alignItems="center">
              <TokenLogo token={CryptoCurrencyCode.stAMB} />
              <Spacer horizontal value={scale(8)} />
              <Text fontSize={scale(12)} color={COLORS.neutral900}>
                {CryptoCurrencyCode.AMB}
              </Text>
            </Row>
            <View>
              <Text
                align="right"
                fontSize={scale(12)}
                color={COLORS.neutral900}
              >
                {amount}
              </Text>
              <Spacer value={scale(8)} />
              <Text
                color={COLORS[isSuccess ? 'success400' : 'warning400']}
                fontSize={scale(12)}
              >
                {t(
                  isSuccess ? 'common.status.success' : 'common.status.pending'
                )}
              </Text>
            </View>
          </Row>
          <Spacer value={scale(8)} />
          <View style={styles.dateWrapper}>
            <Row justifyContent="space-between" alignItems="center">
              <Text fontSize={scale(14)} color={COLORS.neutral600}>
                {t('harbor.requests.date')}
              </Text>
              <Text fontSize={scale(14)} color={COLORS.neutral800}>
                {requestItem.requestData}
              </Text>
            </Row>
            <Spacer value={scale(8)} />
            <Row justifyContent="space-between" alignItems="center">
              <Text fontSize={scale(14)} color={COLORS.neutral600}>
                {t('harbor.unlock.date')}
              </Text>
              <Text fontSize={scale(14)} color={COLORS.neutral800}>
                {requestItem.unlockData}
              </Text>
            </Row>
          </View>
        </View>
        <Spacer value={scale(12)} />
      </>
    );
  };

  const EmptyList = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: scale(40)
        }}
      >
        <Text>{t('common.no.transactions')}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.main, { paddingTop: insets.top }]}>
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
  );
};
