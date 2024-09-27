import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LocalizedRenderEmpty } from '@components/templates/LocalizedRenderEmpty';
import { SingleAsset } from '@components/modular';
import { Button, Spinner } from '@components/base';
import { CryptoCurrencyCode, HomeNavigationProp } from '@appTypes';
import { ExplorerAccount, Token } from '@models';
import { TokenUtils } from '@utils/token';
import { AMB_DECIMALS } from '@constants/variables';

interface WalletAssetsProps {
  tokens: Token[] | undefined;
  loading: boolean;
  error: boolean;
  account: ExplorerAccount;
  isRefreshing?: boolean;
  onRefresh?: () => unknown;
}

export const WalletAssets = (props: WalletAssetsProps): JSX.Element => {
  const { tokens, loading, account, error, isRefreshing, onRefresh } = props;
  const navigation = useNavigation<HomeNavigationProp>();

  const { t } = useTranslation();

  const navigateToAssetScreen = (tokenInfo: Token, walletAccount: string) => {
    const isNFTToken = tokenInfo?.symbol === CryptoCurrencyCode.NFT;
    const screenToNavigate = isNFTToken ? 'NFTScreen' : 'AssetScreen';
    navigation.navigate(screenToNavigate, { tokenInfo, walletAccount });
  };

  const renderToken = ({ item }: { item: Token }) => {
    return (
      <Button onPress={() => navigateToAssetScreen(item, account.address)}>
        <SingleAsset token={item} />
      </Button>
    );
  };

  const ambTokenData: Token[] = [
    new Token(
      {
        name: 'AirDAO',
        address: account.address,
        isNativeCoin: true,
        balance: {
          wei: account.ambBalanceWei,
          ether: account.ambBalance,
          formattedBalance: `${account.ambBalance}`
        },
        symbol: CryptoCurrencyCode.AMB,
        decimals: AMB_DECIMALS,
        tokenNameFromDatabase: 'AirDAO'
      },
      TokenUtils
    )
  ];

  const data = [...ambTokenData, ...(tokens || [])];
  return (
    <View style={{ flex: 1 }}>
      {!data && error && loading ? (
        <LocalizedRenderEmpty text={t('empty.assets')} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderToken}
          ListFooterComponent={() =>
            loading ? (
              <View style={{ alignSelf: 'center' }}>
                <Spinner />
              </View>
            ) : (
              <></>
            )
          }
          contentContainerStyle={{ paddingBottom: '25%' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={Boolean(isRefreshing)}
            />
          }
        />
      )}
    </View>
  );
};
