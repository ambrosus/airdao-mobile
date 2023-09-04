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
  error: boolean;
  account: string;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { tokens, loading, account, error } = props;
  const navigation = useNavigation<HomeNavigationProp>();

  const { t } = useTranslation();

  const navigateToAssetScreen = (
    tokenInfo: {
      name: string;
      address: string;
      balance: { wei: string; ether: number };
    },
    walletAccount: string
  ) => {
    navigation.navigate('AssetScreen', { tokenInfo, walletAccount });
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
      <TouchableOpacity onPress={() => navigateToAssetScreen(item, account)}>
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
      {error ? (
        <LocalizedRenderEmpty text={t('no.assets.yet')} />
      ) : tokens && tokens.length > 0 ? (
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
