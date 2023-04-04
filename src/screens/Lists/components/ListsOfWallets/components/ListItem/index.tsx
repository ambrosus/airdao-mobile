import React, { FC, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { Button, Text } from '@components/base';
import { OptionsIcon } from '@components/svg/icons/Options';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetListAction } from '@screens/Lists/components/ListsOfWallets/components/ListItem/components/BottomSheetListAction';
import { useNavigation } from '@react-navigation/native';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@navigation/stacks/RootStack';

type Props = {
  item: WalletGroup;
};

export const ListItem: FC<Props> = ({ item }) => {
  const listActionRef = useRef<BottomSheetRef>(null);
  const handleOpenListAction = useCallback(() => {
    listActionRef.current?.show();
  }, []);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
  const navigateToLists = () => {
    navigation.navigate('SingleListScreen', {
      item
    });
  };
  return (
    <Button type="base" onPress={navigateToLists}>
      <View style={styles.container}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Spacer value={4} />
          <View style={styles.itemSubInfo}>
            <Text style={styles.walletsCount}>{item.wallets}</Text>
            <Text style={styles.tokensCount}>{item.tokens}</Text>
          </View>
        </View>
        <Button
          style={styles.optionButton}
          type="base"
          onPress={handleOpenListAction}
        >
          <OptionsIcon />
        </Button>
        <BottomSheetListAction ref={listActionRef} />
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingLeft: 19,
    paddingRight: 29,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17
  },
  walletsCount: {
    paddingRight: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  tokensCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    paddingTop: 2
  },
  optionButton: {
    alignItems: 'center',
    width: 25
  }
});
