import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AccountTransactions } from '@components/templates';
import { CopyToClipboardButton, Header } from '@components/composite';
import { NumberInput } from '@components/base/Input/Input.number';
import { PrimaryButton } from '@components/modular';
import { Input, Row, Spacer, Spinner, Text } from '@components/base';
import { AddWalletStackNavigationProp, WalletStackParamsList } from '@appTypes';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';
import { API } from '@api/api';
import { ExplorerAccount, Transaction } from '@models';
import { StringUtils } from '@utils/string';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { etherumAddressRegex } from '@constants/regex';

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
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const route = useRoute<RouteProp<WalletStackParamsList, 'WalletAccount'>>();
  const { wallet } = route.params;

  const [error, setError] = useState('');
  const [account, setAccount] = useState<ExplorerAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const transactionsRef = useRef(transactions);
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  // state for money sending
  const [amountToSend, setAmountToSend] = useState('');
  const [addressToSend, setAddressToSend] = useState('');

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
      console.log(error, 'error loading acc transactions');
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
      console.log({ info });
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
    setTimeout(() => {
      getWalletInfo(); // delay the call
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMoney = async () => {
    const intAmount = parseFloat(amountToSend);
    if (Number.isNaN(intAmount)) {
      return;
    }
    if (!addressToSend.match(etherumAddressRegex)) {
      // TODO
      Alert.alert('Check destination address');
      return;
    }
    if (!account) {
      console.log('there is no account!', account);
      return;
    }
    navigation.navigate('ReceiptScreen', {
      amount: intAmount,
      currencyCode: 'AMB',
      destination: addressToSend,
      origin: account.address,
      hash: wallet.hash
    });
  };

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

  // console.log(account.ambBalance, 'account.ambBalance');

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
        <Text title>Send money</Text>
        <Spacer value={verticalScale(12)} />
        <NumberInput
          value={amountToSend}
          onChangeValue={setAmountToSend}
          placeholder="Amount"
        />
        <Spacer value={verticalScale(12)} />
        <Input
          value={addressToSend}
          onChangeValue={setAddressToSend}
          placeholder="Destination address"
        />
        <Spacer value={verticalScale(12)} />
        <PrimaryButton onPress={sendMoney}>
          <Text color={COLORS.white}>Send</Text>
        </PrimaryButton>
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
