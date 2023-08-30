import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
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
  account: ExplorerAccount;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { assets, loading, account } = props;
  const navigation = useNavigation<WalletsNavigationProp>();

  // tslint:disable-next-line:no-shadowed-variable
  const navigateToAssetScreen = (account: ExplorerAccount) => {
    navigation.navigate('AssetScreen', { account });
  };

  const renderAssets = (): JSX.Element => {
    return (
      <TouchableOpacity onPress={() => navigateToAssetScreen(account)}>
        <SingleAsset account={account} />
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
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <LocalizedRenderEmpty text="No assets yet" />
      )}
    </View>
  );
};
