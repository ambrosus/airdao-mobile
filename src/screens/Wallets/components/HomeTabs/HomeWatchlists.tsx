import React, { useCallback } from 'react';
import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { RenderItem } from '@components/templates/WalletList/components/RenderItem';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';

export const HomeWatchlists = () => {
  const { watchlist } = useWatchlist();

  const navigation = useNavigation<PortfolioNavigationProp>();

  const navigateToPortfolio = useCallback(() => {
    setTimeout(() => {
      navigation.navigate('Portfolio');
    }, 400);
  }, [navigation]);

  return (
    <View style={styles.homeWatchlistsContainer}>
      <View style={{ flex: 1 }}>
        {watchlist.slice(0, 4).map((item, index) => {
          return (
            <View key={index}>
              <RenderItem item={item} idx={index} isPortfolioFlow={false} />
            </View>
          );
        })}
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
