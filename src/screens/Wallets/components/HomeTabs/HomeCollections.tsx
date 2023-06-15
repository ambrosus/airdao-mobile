import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useLists } from '@contexts';
import { GroupItem } from '@screens/Portfolio/components/ListsOfAddressGroup/components/GroupItem';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { PortfolioNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { RenderEmpty } from '@components/templates/RenderEmpty';
import { scale } from '@utils/scaling';
import { AccountList } from '@models';

export const HomeCollections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);

  const navigation = useNavigation<PortfolioNavigationProp>();

  const navigateToPortfolio = useCallback(() => {
    setTimeout(() => {
      navigation.navigate('Portfolio');
    }, 400);
  }, [navigation]);

  const navigateToCollectionDetails = (group: AccountList) => {
    navigation.navigate('Collection', { group });
  };

  if (listsOfAddressGroup.length === 0) {
    return <RenderEmpty text="collections" />;
  }

  return (
    <View style={styles.homeCollectionsContainer}>
      <View style={{ flex: 1, paddingTop: scale(10) }}>
        {listsOfAddressGroup.slice(0, 4).map((item, index) => {
          return (
            <Button
              onPress={() => navigateToCollectionDetails(item)}
              key={item.id}
            >
              <GroupItem
                group={item}
                isFirstItem={index === 0}
                wrapperStyles={{
                  paddingVertical: 32,
                  borderTopWidth: 0,
                  borderBottomWidth: 0
                }}
                swipeable={false}
              />
            </Button>
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
