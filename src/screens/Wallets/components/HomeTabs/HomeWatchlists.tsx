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
    setTimeout(() => {
      navigation.navigate('Portfolio');
    }, 400);
  }, [navigation]);

  if (watchlist.length === 0) {
    return <RenderEmpty text="addresses" />;
  }

  const renderWallet = (args: ListRenderItemInfo<ExplorerAccount>) => {
    return (
      <View>
        <WalletItem item={args.item} />
        <Spacer value={verticalScale(24)} />
      </View>
    );
  };

  return (
    <View style={styles.homeWatchlistsContainer}>
      <View style={{ flex: 1 }}>
        <WalletList
          isListOpened={true}
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
