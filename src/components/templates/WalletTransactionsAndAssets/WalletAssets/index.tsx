import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Spinner } from '@components/base';
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { LocalizedRenderEmpty } from '@components/templates';
import { Wallet } from '@models/Wallet';

interface WalletAssetsProps {
  assets: Wallet[];
  loading?: boolean;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { assets, loading } = props;

  const renderAssets = (args: ListRenderItemInfo<Wallet>): JSX.Element => {
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
