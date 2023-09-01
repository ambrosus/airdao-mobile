import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { LocalizedRenderEmpty } from '@components/templates';
import { useNavigation } from '@react-navigation/native';
import { Spinner } from '@components/base';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';

interface WalletAssetsProps {
  tokens:
    | {
        name: string;
        address: string;
        balance: { wei: string; ether: number };
      }[]
    | undefined;
  loading: boolean;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { tokens, loading } = props;
  const navigation = useNavigation<HomeNavigationProp>();

  const { t } = useTranslation();

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
            paddingBottom: 100
          }}
        />
      ) : (
        <LocalizedRenderEmpty text={t('no.assets.yet')} />
      )}
    </View>
  );
};
