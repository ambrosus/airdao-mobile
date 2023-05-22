import React, { useCallback } from 'react';
import { useWatchlist } from '@hooks';
import { StyleSheet, View } from 'react-native';
import { RenderItem } from '@components/templates/WalletList/components/RenderItem';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';

export const HomeWatchlists = () => {
  const { watchlist } = useWatchlist();

  const navigation = useNavigation<PortfolioNavigationProp>();

  const navigateToPortfolio = useCallback(() => {
    setTimeout(() => {
      navigation.navigate('Portfolio');
    }, 400);
  }, [navigation]);

  return (
    <View style={{ paddingHorizontal: 24, flex: 1 }}>
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

const styles = StyleSheet.create({
  seeAllButton: {
    alignItems: 'center',
    backgroundColor: '#edf3ff',
    borderRadius: 24,
    alignSelf: 'center',
    width: '100%',
    marginBottom: scale(24)
  }
});
