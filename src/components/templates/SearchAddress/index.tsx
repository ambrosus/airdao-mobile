import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View
} from 'react-native';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { InputWithIcon } from '@components/composite';
import { ScannerIcon, SearchIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { useExplorerInfo, useSearchAccount } from '@hooks/query';
import { ExplorerAccountView } from '../ExplorerAccount';
import { styles } from './styles';

interface SearchAdressProps {
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

export const SearchAdress = (props: SearchAdressProps): JSX.Element => {
  const { onContentVisibilityChanged } = props;
  const [address, setAddress] = useState('');
  const { data: explorerInfo } = useExplorerInfo();
  const {
    data: account,
    loading,
    error
  } = useSearchAccount(address, !!address);

  const onInputFocused = () => {
    if (typeof onContentVisibilityChanged === 'function') {
      onContentVisibilityChanged(true);
    }
  };

  const onInputBlur = () => {
    if (
      typeof onContentVisibilityChanged === 'function' &&
      !account &&
      !loading
    ) {
      onContentVisibilityChanged(false);
    }
  };

  const onInputSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    setAddress(e.nativeEvent.text);
  };

  return (
    <>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.top}
      >
        <InputWithIcon
          style={styles.input}
          iconLeft={<SearchIcon color="#2f2b4399" />}
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
      <Spacer value={verticalScale(22)} />
      {loading && <Spinner />}
      {error && <Text>Could not find the address</Text>}
      {account && explorerInfo && (
        <ExplorerAccountView
          account={account}
          totalSupply={explorerInfo.totalSupply}
        />
      )}
      <Spacer value={verticalScale(24)} />
      <View style={styles.divider} />
      <Spacer value={verticalScale(24)} />
    </>
  );
};
