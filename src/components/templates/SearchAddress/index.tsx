import React, { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View
} from 'react-native';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { InputWithIcon } from '@components/composite';
import { CloseIcon, ScannerIcon, SearchIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import {
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount
} from '@hooks/query';
import { ExplorerAccountView } from '../ExplorerAccount';
import { AccountTransactions } from '../ExplorerAccount/ExplorerAccount.Transactions';
import { styles } from './styles';

interface SearchAdressProps {
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

const LIMIT = 10;

export const SearchAdress = (props: SearchAdressProps): JSX.Element => {
  const { onContentVisibilityChanged = () => null } = props;
  const [address, setAddress] = useState('');
  const { data: explorerInfo } = useExplorerInfo();
  const initialMount = useRef(true);
  const inputRef = useRef<InputRef>(null);
  const {
    data: account,
    loading,
    error
  } = useSearchAccount(address, !initialMount.current);
  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage,
    hasNextPage
  } = useTransactionsOfAccount(address, 1, LIMIT, '', !!address);

  const onInputFocused = () => {
    onContentVisibilityChanged(true);
  };

  const onInputBlur = () => {
    if (!account && !loading) {
      onContentVisibilityChanged(false);
    }
  };

  const onInputSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    initialMount.current = false;
    setAddress(e.nativeEvent.text);
  };

  const incrementPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const clearInput = () => {
    inputRef.current?.clear();
    setAddress('');
    onContentVisibilityChanged(false);
  };

  return (
    <>
      <KeyboardDismissingView>
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={styles.top}
        >
          <InputWithIcon
            ref={inputRef}
            style={styles.input}
            iconLeft={<SearchIcon color="#2f2b4399" />}
            iconRight={
              <Button onPress={clearInput}>
                <CloseIcon color="#2f2b4399" scale={0.75} />
              </Button>
            }
            placeholder={'Search public address'}
            returnKeyType="search"
            onFocus={onInputFocused}
            onBlur={onInputBlur}
            onSubmitEditing={onInputSubmit}
          />
          <Spacer value={scale(7.5)} horizontal />
          <Button>
            <ScannerIcon color="#000000" />
          </Button>
        </Row>
      </KeyboardDismissingView>
      {loading && !!address && <Spinner />}
      {error && !!address && <Text>Could not find the address</Text>}
      {account && explorerInfo && (
        <>
          <Spacer value={verticalScale(22)} />
          <KeyboardDismissingView>
            <ExplorerAccountView
              account={account}
              totalSupply={explorerInfo.totalSupply}
            />
          </KeyboardDismissingView>
          <Spacer value={verticalScale(24)} />
          <View style={styles.divider} />
          <Spacer value={verticalScale(24)} />
          <AccountTransactions
            transactions={transactions}
            onEndReached={incrementPage}
            loading={transactionsLoading && !!address}
          />
        </>
      )}
    </>
  );
};
