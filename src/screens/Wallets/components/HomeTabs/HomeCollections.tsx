import React from 'react';
import { View } from 'react-native';
import { useLists } from '@contexts';
import { Button, Spacer } from '@components/base';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { RenderEmpty } from '@components/templates/RenderEmpty';
import { verticalScale } from '@utils/scaling';
import { AccountList } from '@models';
import { CollectionItem } from '@components/modular';

const ITEM_COUNT = 4;

export const HomeCollections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);

  const navigation = useNavigation<PortfolioNavigationProp>();

  const navigateToCollectionDetails = (group: AccountList) => {
    navigation.navigate('Collection', { group });
  };

  if (listsOfAddressGroup.length === 0) {
    return <RenderEmpty text="collections" />;
  }

  return (
    <View style={styles.homeCollectionsContainer} testID="Home_Collections">
      {listsOfAddressGroup.slice(0, ITEM_COUNT).map((item, index) => {
        return (
          <View key={item.id}>
            <Button onPress={() => navigateToCollectionDetails(item)}>
              <CollectionItem collection={item} />
            </Button>
            {index !== ITEM_COUNT - 1 && <Spacer value={verticalScale(24)} />}
          </View>
        );
      })}
    </View>
  );
};
