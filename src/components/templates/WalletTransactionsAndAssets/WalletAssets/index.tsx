import React from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LocalizedRenderEmpty } from '@components/templates';
import { SingleAsset } from '@components/modular';
import { Button, Spinner } from '@components/base';
import { HomeNavigationProp } from '@appTypes';
import { ExplorerAccount, TokenDTO } from '@models';
import { verticalScale } from '@utils/scaling';

interface WalletAssetsProps {
  tokens: TokenDTO[] | undefined;
  loading: boolean;
  error: boolean;
  account: ExplorerAccount;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { tokens, loading, account, error } = props;
  const navigation = useNavigation<HomeNavigationProp>();

  const { t } = useTranslation();

  const navigateToAssetScreen = (
    tokenInfo: TokenDTO,
    walletAccount: string
  ) => {
    navigation.navigate('AssetScreen', { tokenInfo, walletAccount });
  };

  const renderToken = ({ item }: { item: TokenDTO }) => {
    return (
      <Button onPress={() => navigateToAssetScreen(item, account.address)}>
        <SingleAsset token={item} />
      </Button>
    );
  };

  const ambTokenData: TokenDTO[] = [
    {
      name: 'AMB',
      address: account.address,
      balance: { wei: '', ether: account.ambBalance },
      symbol: 'AMB'
    }
  ];

  const data = [...ambTokenData, ...(tokens || [])];

  return (
    <View style={{ flex: 1, paddingBottom: verticalScale(100) }}>
      {!data && error && loading ? (
        <LocalizedRenderEmpty text={t('no.assets.yet')} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderToken}
          ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
