import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View
} from 'react-native';
import { Spinner } from '@components/base';
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { LocalizedRenderEmpty } from '@components/templates';
import { Wallet } from '@models/Wallet';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { ExplorerAccount } from '@models';

interface WalletAssetsProps {
  assets: Wallet[];
  loading?: boolean;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { assets, loading } = props;
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigateToAssetScreen = (asset: ExplorerAccount) => {
    navigation.navigate('AssetScreen', { asset });
  };

  const renderAssets = (args: ListRenderItemInfo<Wallet>): JSX.Element => {
    const { item } = args;

    return (
      <TouchableOpacity onPress={() => navigateToAssetScreen(item)}>
        <SingleAsset asset={item} />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {assets ? (
        <FlatList
          data={assets}
          renderItem={renderAssets}
          ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
        />
      ) : (
        <LocalizedRenderEmpty text="No assets yet" />
      )}
    </View>
  );
};
