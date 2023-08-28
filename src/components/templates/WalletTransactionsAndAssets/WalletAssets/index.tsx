import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Spinner } from '@components/base';
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { ExplorerAccount } from '@models';
import { LocalizedRenderEmpty } from '@components/templates';

interface WalletAssetsProps {
  assets: ExplorerAccount[];
  loading?: boolean;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { assets, loading } = props;
  const renderAssets = (
    args: ListRenderItemInfo<ExplorerAccount>
  ): JSX.Element => {
    return <SingleAsset asset={args.item} />;
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
