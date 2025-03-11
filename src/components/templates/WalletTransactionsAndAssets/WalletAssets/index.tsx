import { forwardRef, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode, HomeNavigationProp } from '@appTypes';
import { Button, Spinner } from '@components/base';
import { SingleAsset } from '@components/modular';
import { LocalizedRenderEmpty } from '@components/templates/LocalizedRenderEmpty';
import { AMB_DECIMALS } from '@constants/variables';
import { ExplorerAccount, Token } from '@models';
import { TokenUtils } from '@utils';
import { styles } from './styles';

interface WalletAssetsProps {
  tokens: Token[] | undefined;
  loading?: boolean;
  error: boolean;
  account: ExplorerAccount;
  isRefreshing?: boolean;
  onRefresh?: () => unknown;
}

export const WalletAssets = forwardRef<FlatList, WalletAssetsProps>(
  ({ tokens, loading, account, error, isRefreshing, onRefresh }, ref) => {
    const { t } = useTranslation();
    const navigation = useNavigation<HomeNavigationProp>();

    const navigateToAssetScreen = useCallback(
      (tokenInfo: Token, walletAccount: string) => {
        navigation.navigate('AssetScreen', { tokenInfo, walletAccount });
      },
      [navigation]
    );

    const renderToken = ({ item }: { item: Token }) => {
      const onNavigateToAssetScreen = () =>
        navigateToAssetScreen(item, account.address);

      return (
        <Button onPress={onNavigateToAssetScreen}>
          <SingleAsset token={item} />
        </Button>
      );
    };

    const ambTokenData: Token[] = useMemo(
      () => [
        new Token(
          {
            name: 'AirDAO',
            address: account.address,
            isNativeCoin: true,
            balance: {
              wei: account.ambBalanceWei,
              ether: account.ambBalance,
              formattedBalance: ethers.utils.formatUnits(
                account.ambBalanceWei,
                AMB_DECIMALS
              )
            },
            symbol: CryptoCurrencyCode.AMB,
            decimals: AMB_DECIMALS,
            tokenNameFromDatabase: 'AirDAO'
          },
          TokenUtils
        )
      ],
      [account.address, account.ambBalance, account.ambBalanceWei]
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

    const data = useMemo(() => {
      return [...ambTokenData, ...(tokens || [])];
    }, [ambTokenData, tokens]);

    return (
      <View style={styles.container}>
        {!data && error && loading ? (
          <LocalizedRenderEmpty text={t('empty.assets')} />
        ) : (
          <FlatList
            ref={ref}
            data={data}
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
        )}
      </View>
    );
  }
);
