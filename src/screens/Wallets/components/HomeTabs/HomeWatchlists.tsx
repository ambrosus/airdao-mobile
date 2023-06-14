import React, { useCallback } from 'react';
import { useWatchlist } from '@hooks';
import { ListRenderItemInfo, View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { RenderEmpty } from '@components/templates/RenderEmpty';
import { WalletItem, WalletList } from '@components/templates';
import { ExplorerAccount } from '@models';
import { verticalScale } from '@utils/scaling';

export const HomeWatchlists = () => {
  const { watchlist } = useWatchlist();

  const navigation = useNavigation<PortfolioNavigationProp>();

  const navigateToPortfolio = useCallback(() => {
    navigation.navigate('Portfolio', {
      screen: 'PortfolioScreen',
      params: {
        tabs: { activeTab: 0 }
      }
    });
  }, [navigation]);

  if (watchlist.length === 0) {
    return <RenderEmpty text="addresses" />;
  }

  const navigateToAddressDetails = (item: ExplorerAccount) => {
    return navigation.navigate('Address', { address: item.address });
  };

  const renderWallet = (args: ListRenderItemInfo<ExplorerAccount>) => {
    return (
      <View>
        <Button onPress={() => navigateToAddressDetails(args.item)}>
          <WalletItem item={args.item} />
        </Button>
        <Spacer value={verticalScale(24)} />
      </View>
    );
  };

  return (
    <View style={styles.homeWatchlistsContainer}>
      <View style={{ flex: 1 }}>
        <WalletList
          isPortfolioFlow={false}
          emptyText=""
          data={watchlist.slice(0, 4)}
          scrollEnabled={false}
          renderItem={renderWallet}
        />
      </View>
      <Button onPress={navigateToPortfolio} style={styles.seeAllButton}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.deepBlue}
          style={{ marginVertical: 12 }}
        >
          See all
        </Text>
      </Button>
    </View>
  );
};
