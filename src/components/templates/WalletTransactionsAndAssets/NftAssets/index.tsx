import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { styles } from './styles';
import { Token } from '@models';
import { Button, Spinner } from '@components/base';
import { SingleAssetNFT } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { CryptoCurrencyCode, HomeNavigationProp } from '@appTypes';
import { useWalletStore } from '@entities/wallet';
import { WalletNoNFTsView } from '@components/templates';

interface NftAssetsProps {
  nfts: Token[];
  loading: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => unknown;
}

export const NftAssets = ({
  nfts,
  loading,
  isRefreshing,
  onRefresh
}: NftAssetsProps) => {
  const navigation = useNavigation<HomeNavigationProp>();

  const { wallet } = useWalletStore();

  const navigateToAssetScreen = useCallback(
    (tokenInfo: Token, walletAccount: string) => {
      const isNFTToken = tokenInfo?.symbol === CryptoCurrencyCode.NFT;

      if (isNFTToken)
        navigation.navigate('NFTScreen', { tokenInfo, walletAccount });
    },
    [navigation]
  );

  const renderToken = useCallback(
    ({ item }: { item: Token }) => {
      const onNavigateToAssetScreen = () =>
        navigateToAssetScreen(item, wallet?.address ?? '');

      return (
        <Button onPress={onNavigateToAssetScreen}>
          <SingleAssetNFT token={item} />
        </Button>
      );
    },
    [navigateToAssetScreen, wallet?.address]
  );

  const RenderListFooterComponent = useCallback(
    () =>
      loading && (
        <View style={styles.loader}>
          <Spinner />
        </View>
      ),
    [loading]
  );

  if (nfts.length === 0) {
    return <WalletNoNFTsView />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={nfts}
        renderItem={renderToken}
        ListFooterComponent={RenderListFooterComponent}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={Boolean(isRefreshing)}
          />
        }
      />
    </View>
  );
};
