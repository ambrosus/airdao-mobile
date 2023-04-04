import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { OptionsIcon } from '@components/svg/icons/Options';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { BackIcon } from '@components/svg/icons';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { FloatButton } from '@components/base/FloatButton';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { BottomSheetOptions } from '@screens/Lists/screens/SIngleListScreen/components/BottomSheetOptions';
import { BottomSheetRef } from '@components/composite';

export const SingleListScreen = () => {
  const {
    params: {
      item: { listOfWallets, wallets, tokens, title }
    }
  } = useRoute<RouteProp<RootStackParamsList, 'SingleListScreen'>>();

  const optionsRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation();

  const handleOnOptions = useCallback(() => {
    optionsRef.current?.show();
  }, []);

  const customHeader = useMemo(() => {
    return (
      <View style={styles.container}>
        <View style={styles.itemInfo}>
          <Button onPress={navigation.goBack}>
            <BackIcon />
          </Button>
          <View style={{ paddingLeft: 20 }}>
            <Text title style={styles.itemTitle}>
              {title}
            </Text>
            <Spacer value={4} />
            <View style={styles.itemSubInfo}>
              <Text style={styles.walletsCount}>{wallets}</Text>
              <Text style={styles.tokensCount}>{tokens}</Text>
            </View>
          </View>
        </View>
        <Button
          onPress={handleOnOptions}
          type="base"
          style={styles.optionsButton}
        >
          <OptionsIcon />
        </Button>
      </View>
    );
  }, [handleOnOptions, navigation.goBack, title, tokens, wallets]);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 17 }}>
      {customHeader}
      <Spacer value={29} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 150
        }}
        data={listOfWallets}
        renderItem={({ item }) => {
          return (
            <View style={styles.flatListContainer}>
              <Row justifyContent="space-between">
                <Text fontFamily="Inter_600SemiBold" fontSize={13}>
                  {item.wallet}
                </Text>
                <Text fontFamily="Mersad_600SemiBold" fontSize={13}>
                  {item.price}
                </Text>
              </Row>
              <Spacer value={5} />
              <Row justifyContent="space-between">
                <Text
                  fontFamily="Mersad_600SemiBold"
                  fontSize={13}
                  color={COLORS.grey}
                >
                  {item.token}
                </Text>
                <Row justifyContent="space-between" alignItems="center">
                  <ProgressArrowIcon />
                  <Text
                    fontFamily="Mersad_600SemiBold"
                    fontSize={12}
                    color={COLORS.grey}
                    style={styles.progressIcon}
                  >
                    {item.progress}
                  </Text>
                </Row>
              </Row>
            </View>
          );
        }}
      />
      <FloatButton
        title="Add Wallet"
        icon={<AddIcon />}
        bottomPadding={0}
        onPress={() => {
          // tslint:disable-next-line:no-console
          console.info('123');
        }}
      />
      <BottomSheetOptions ref={optionsRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 32,
    justifyContent: 'space-between'
  },
  progressIcon: {
    paddingLeft: 7
  },
  container: {
    paddingTop: 15,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {
    flexDirection: 'row'
  },
  itemSubInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {},
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
  optionsButton: { alignItems: 'center', height: '100%', width: 35 }
});
