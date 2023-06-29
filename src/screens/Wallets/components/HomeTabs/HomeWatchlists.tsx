import React from 'react';
import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { RenderEmpty } from '@components/templates/RenderEmpty';
import { WalletItem } from '@components/templates';
import { ExplorerAccount } from '@models';
import { verticalScale } from '@utils/scaling';

const ITEM_COUNT = 4;

export const HomeWatchlists = () => {
  const { watchlist } = useWatchlist();

  const navigation = useNavigation<PortfolioNavigationProp>();

  if (watchlist.length === 0) {
    return <RenderEmpty text="addresses" />;
  }

  const navigateToAddressDetails = (item: ExplorerAccount) => {
    return navigation.navigate('Address', { address: item.address });
  };

  return (
    <View style={styles.homeWatchlistsContainer}>
      {watchlist.slice(0, ITEM_COUNT).map((item, index) => {
        return (
          <View key={item._id}>
            <Button onPress={() => navigateToAddressDetails(item)}>
              <WalletItem item={item} indicatorVisible={true} />
            </Button>
            {index !== ITEM_COUNT - 1 && <Spacer value={verticalScale(24)} />}
          </View>
        );
      })}
    </View>
  );
};
