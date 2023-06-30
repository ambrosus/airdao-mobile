import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetRef, Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EditIcon, OptionsIcon, ShareIcon } from '@components/svg/icons';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import {
  ExplorerAccountView,
  AccountTransactions,
  SharePortfolio
} from '@components/templates';
import {
  useAMBPrice,
  useExplorerInfo,
  usePersonalList,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { Toast, ToastType } from '@components/modular';
import { styles } from './styles';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';

const TRANSACTION_LIMIT = 50;
export const AddressDetails = (): JSX.Element => {
  const { params } = useRoute<RouteProp<CommonStackParamsList, 'Address'>>();
  const { address } = params;
  const initialMount = useRef(true);
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
  const { personalList } = usePersonalList();
  const editModal = useRef<BottomSheetRef>(null);
  const shareModal = useRef<BottomSheetRef>(null);

  const walletInWatchlist = watchlist.find((w) => w.address === address);
  const walletInPersonalList = personalList.find((w) => w.address === address);
  const finalAccount = walletInWatchlist || walletInPersonalList || account;

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
          <Text>Error Occurred</Text>
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

  const shareShareModal = () => {
    shareModal.current?.show();
  };

  const onToggleWatchlist = (isOnWatchlist: boolean) => {
    Toast.hide();
    const toastMessage = isOnWatchlist
      ? `${finalAccount.name || 'The address'} is now on your Watchlists!`
      : `You removed ${finalAccount.name || 'the address'} from Watchlists!`;
    Toast.show({ message: toastMessage, type: ToastType.Top, title: '' });
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
            <Button
              style={styles.headerBtn}
              type="circular"
              onPress={shareShareModal}
              testID="Share_Button"
            >
              <ShareIcon color={COLORS.smokyBlack} />
            </Button>
            <Spacer value={scale(32)} horizontal />
            <Button
              style={styles.headerBtn}
              type="circular"
              onPress={showEditModal}
              testID="Edit_Button"
            >
              {Platform.select({
                ios: <EditIcon color={COLORS.smokyBlack} />,
                android: <OptionsIcon color={COLORS.smokyBlack} />
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
      <Spacer value={verticalScale(32)} />
      <View style={styles.divider} />
      <Spacer value={verticalScale(32)} />
      <AccountTransactions
        transactions={transactions}
        onEndReached={loadMoreTransactions}
        loading={transactionsLoading && !!address}
      />
      <BottomSheetEditWallet ref={editModal} wallet={finalAccount} />
      <SharePortfolio
        ref={shareModal}
        title={StringUtils.formatAddress(finalAccount.address, 7, 4)}
        bottomSheetTitle="Share address performance"
        balance={NumberUtils.abbreviateNumber(finalAccount.ambBalance)}
        currency={'AMB'}
        currencyPosition={'right'}
        last24HourChange={ambPrice?.percentChange24H || 0}
        timestamp={ambPrice?.timestamp || new Date()}
      />
    </SafeAreaView>
  );
};
