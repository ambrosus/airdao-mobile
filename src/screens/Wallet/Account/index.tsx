import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  AccountTransactions,
  ExplorerAccountTransactionItem
} from '@components/templates';
import { CopyToClipboardButton, Header } from '@components/composite';
import { WalletStackParamsList } from '@appTypes';
import { Row, Spacer, Spinner, Text } from '@components/base';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { API } from '@api/api';
import { ExplorerAccount, Transaction } from '@models';
import { StringUtils } from '@utils/string';
import { scale, verticalScale } from '@utils/scaling';

const Layout = (props: PropsWithChildren) => {
  const route = useRoute<RouteProp<WalletStackParamsList, 'WalletAccount'>>();
  const { wallet } = route.params;
  return (
    <SafeAreaView>
      <Header title={wallet.name} />
      {props.children}
    </SafeAreaView>
  );
};

const LIMIT = 25;

export const WalletAccount = () => {
  const route = useRoute<RouteProp<WalletStackParamsList, 'WalletAccount'>>();
  const { wallet } = route.params;

  const [error, setError] = useState('');
  const [account, setAccount] = useState<ExplorerAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const transactionsRef = useRef(transactions);
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const getTransactions = async (address: string) => {
    if (transactions.length > 0 && transactions.length < LIMIT) return;
    setTransactionsLoading(true);
    try {
      const transactions = await API.explorerService.getTransactionsOfAccount(
        address,
        (transactionsRef.current.length % LIMIT) + 1,
        LIMIT
      );
      setTransactions(
        transactions.data.map(
          (transactionDTO) => new Transaction(transactionDTO)
        )
      );
    } catch (error) {
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getWalletInfo = async () => {
    setError('');
    try {
      const info = await AirDAOKeysForRef.discoverPublicAndPrivate({
        mnemonic: wallet.mnemonic
      });
      if (info) {
        const { address } = info;
        // @ts-ignore
        setAccount({ address, ambBalance: 0 });
        getTransactions(address);
        setAccountInfoLoading(true);
        const account = await API.explorerService.searchAddress(address);
        setAccount(new ExplorerAccount(account));
      }
    } catch (error) {
      // setError('Could not get wallet details');
    } finally {
      setAccountInfoLoading(false);
    }
  };

  useEffect(() => {
    getWalletInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!wallet) {
    return (
      <SafeAreaView>
        <Text>Wallet is not provided</Text>
      </SafeAreaView>
    );
  }

  if (error !== '') {
    return (
      <Layout>
        <Text>{error}</Text>
      </Layout>
    );
  }

  if (accountInfoLoading || !account) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  const renderTransaction = (
    args: ListRenderItemInfo<Transaction>
  ): JSX.Element => {
    return (
      <ExplorerAccountTransactionItem
        transaction={args.item}
        // disabled={showTransactionDetailsOnPress}
      />
    );
  };

  return (
    <Layout>
      <View style={{ paddingHorizontal: scale(16) }}>
        <Spacer value={verticalScale(16)} />
        <Row justifyContent="space-between" alignItems="center">
          <Text>Address</Text>
          <CopyToClipboardButton
            textToDisplay={StringUtils.formatAddress(account.address, 9, 4)}
            textToCopy={account.address}
          />
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Text>AMB Balance</Text>
          <Text>{account.ambBalance} AMB</Text>
        </Row>
        <Spacer value={verticalScale(16)} />
        <AccountTransactions
          transactions={transactions}
          loading={transactionsLoading}
          onEndReached={() => getTransactions(account.address)}
        />
      </View>
    </Layout>
  );
};
