import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Spinner } from '@components/base';
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { LocalizedRenderEmpty } from '@components/templates';
import { WalletsNavigationProp } from '@appTypes';
import { useNavigation } from '@react-navigation/native';
import { verticalScale } from '@utils/scaling';

interface WalletAssetsProps {
  tokens: {
    name: string;
    address: string;
    balance: { wei: string; ether: number };
  }[];
  loading?: boolean;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { tokens, loading } = props;
  const navigation = useNavigation<WalletsNavigationProp>();

  const navigateToAssetScreen = (tokenInfo: {
    name: string;
    address: string;
    balance: { wei: string; ether: number };
  }) => {
    navigation.navigate('AssetScreen', { tokenInfo });
  };

  const renderToken = ({
    item
  }: {
    item: {
      name: string;
      address: string;
      balance: { wei: string; ether: number };
    };
  }) => {
    return (
      <TouchableOpacity onPress={() => navigateToAssetScreen(item)}>
        <SingleAsset
          address={item.address}
          name={item.name}
          balance={item.balance}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {tokens && tokens.length > 0 ? (
        <FlatList
          data={tokens}
          renderItem={renderToken}
          ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: verticalScale(1200)
          }}
        />
      ) : (
        <LocalizedRenderEmpty text="No assets yet" />
      )}
    </View>
  );
};
