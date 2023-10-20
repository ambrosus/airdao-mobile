import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetRef, Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EditIcon, OptionsIcon } from '@components/svg/icons';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import {
  ExplorerAccountView,
  AccountTransactions,
  SharePortfolio
} from '@components/templates';
import {
  useAMBPrice,
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { styles } from './styles';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { useTranslation } from 'react-i18next';

const TRANSACTION_LIMIT = 50;
export const AddressDetails = (): JSX.Element => {
  const { params } = useRoute<RouteProp<CommonStackParamsList, 'Address'>>();
  const { address } = params;
  const initialMount = useRef(true);
  const { t } = useTranslation();
  const {
    data: account,
    loading: accountLoading,
    error: accountError
  } = useSearchAccount(address, initialMount.current);
  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage,
    hasNextPage
  } = useTransactionsOfAccount(
    address,
    1,
    TRANSACTION_LIMIT,
    '',
    !initialMount.current // not fetching transaction on initial mount to prevent FPS drop caused by moment.fromNow inside <TransactionItem /> component.
  );
  initialMount.current = false;
  const { data: explorerInfo, loading: explorerLoading } = useExplorerInfo();
  const { data: ambPrice } = useAMBPrice();
  const { watchlist } = useWatchlist();
  const editModal = useRef<BottomSheetRef>(null);
  const shareModal = useRef<BottomSheetRef>(null);

  const walletInWatchlist = watchlist.find((w) => w.address === address);
  const finalAccount = walletInWatchlist || account;

  if (accountLoading || explorerLoading || !finalAccount || !explorerInfo) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View testID="loading-spinner" style={styles.center}>
          <Spinner />
        </View>
      </SafeAreaView>
    );
  }

  if (accountError) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <Header />
        <View style={styles.center}>
          <Text>{t('error.loading.account')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const showEditModal = () => {
    editModal.current?.show();
  };

  // const shareShareModal = () => {
  //   shareModal.current?.show();
  // };

  const onToggleWatchlist = (isOnWatchlist: boolean) => {
    Toast.hide();
    const toastMessage = isOnWatchlist
      ? `${t('toast.you.added.address.to.watchlist', {
          name: finalAccount.name || t('common.address').toUpperCase()
        })}`
      : `${t('toast.you.removed.address.from.watchlist', {
          name: finalAccount.name
        })}}`;
    Toast.show({
      text: toastMessage,
      position: ToastPosition.Top,
      type: ToastType.Success
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      testID="Address_Screen"
      style={styles.container}
    >
      <Header
        contentRight={
          <Row alignItems="center">
            {/*<Button*/}
            {/*  style={styles.headerBtn}*/}
            {/*  type="circular"*/}
            {/*  onPress={shareShareModal}*/}
            {/*  testID="Share_Button"*/}
            {/*>*/}
            {/*  <ShareIcon color={COLORS.neutral900} scale={1.1} />*/}
            {/*</Button>*/}
            <Spacer value={scale(32)} horizontal />
            <Button
              style={styles.headerBtn}
              type="circular"
              onPress={showEditModal}
              testID="Edit_Button"
            >
              {Platform.select({
                ios: <EditIcon color={COLORS.neutral900} scale={1.1} />,
                android: <OptionsIcon color={COLORS.neutral900} />
              })}
            </Button>
          </Row>
        }
      />
      <ExplorerAccountView
        account={finalAccount}
        nameVisible={true}
        onToggleWatchlist={onToggleWatchlist}
      />
      <Spacer value={verticalScale(16)} />
      <View style={styles.divider} />
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center">
        <Spacer horizontal value={scale(16)} />
        <Text
          fontFamily="Inter_700Bold"
          fontSize={20}
          color={COLORS.neutral800}
        >
          {t('common.transactions')}
        </Text>
      </Row>
      <Spacer value={verticalScale(12)} />
      <AccountTransactions
        transactions={transactions}
        onEndReached={loadMoreTransactions}
        loading={transactionsLoading && !!address}
      />
      <BottomSheetEditWallet ref={editModal} wallet={finalAccount} />
      <SharePortfolio
        ref={shareModal}
        title={StringUtils.formatAddress(finalAccount.address, 7, 4)}
        bottomSheetTitle={t('address.share.performance')}
        balance={
          finalAccount.ambBalance < 1000
            ? NumberUtils.formatNumber(finalAccount.ambBalance, 2)
            : NumberUtils.abbreviateNumber(finalAccount.ambBalance)
        }
        currency={'AMB'}
        currencyPosition={'right'}
        last24HourChange={ambPrice?.percentChange24H || 0}
        timestamp={ambPrice?.timestamp || new Date()}
      />
    </SafeAreaView>
  );
};
