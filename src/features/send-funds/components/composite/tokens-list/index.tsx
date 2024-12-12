import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { styles } from './styles';
import { Token } from '@models';
import { TokensListItem } from '../../base';
import { Spacer, Spinner } from '@components/base';
import { useSendFundsStore } from '@features/send-funds';

interface TokensListProps {
  // readonly tokens: Token[];
  readonly selectedToken: Token;
  onSelectToken: (token: Token) => void;
  isFetchingTokens: boolean;
}

export const TokensList = ({
  selectedToken,
  onSelectToken,
  isFetchingTokens
}: TokensListProps) => {
  const { tokens } = useSendFundsStore();
  const renderTokenListItem = useCallback(
    (args: ListRenderItemInfo<Token>) => {
      const { item: token } = args;
      return (
        <TokensListItem
          token={token}
          selectedToken={selectedToken}
          onSelectToken={onSelectToken}
        />
      );
    },
    [onSelectToken, selectedToken]
  );

  if (isFetchingTokens) {
    return (
      <View style={styles.loader}>
        <Spinner />
      </View>
    );
  }

  return (
    <FlatList
      data={tokens}
      keyExtractor={(item) => item.address}
      renderItem={renderTokenListItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      overScrollMode="never"
      ListFooterComponent={<Spacer value={50} />}
    />
  );
};
