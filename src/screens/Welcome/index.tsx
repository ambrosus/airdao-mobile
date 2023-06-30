import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from '@appTypes';
import { Cache, CacheKey } from '@utils/cache';
import { AddAddressIcon } from '@components/svg/icons/AddAddress';
import { TrackAMBIcon } from '@components/svg/icons/TrackAMB';
import { ManageCollections } from '@components/svg/icons/ManageCollections';

const screenHeight = Dimensions.get('screen').height;
const spacerValue = screenHeight < 800 ? scale(20) : scale(35);

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TabsParamsList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Spacer value={scale(16)} />
        <Row justifyContent="center" alignItems="center">
          <AirDAOLogo />
          <Spacer horizontal value={scale(8)} />
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={15}
            color={COLORS.smokyBlack}
          >
            AirDAO
          </Text>
        </Row>
        <Spacer value={spacerValue} />
        <View style={styles.optionsContainer} testID="Options_List">
          <Text
            fontFamily="Inter_700Bold"
            fontSize={24}
            color={COLORS.smokyBlack}
          >
            Experience the ease of tracking addresses on the go!
          </Text>
          <Spacer value={scale(36)} />
          <Row
            alignItems="center"
            style={{ paddingRight: 60 }}
            testID="First_Option"
          >
            <View style={styles.icon}>
              <AddAddressIcon />
            </View>
            <Spacer horizontal value={scale(24)} />
            <View style={{ paddingRight: 50 }}>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.smokyBlack}
              >
                Add address to your watchlist
              </Text>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color="#a1a6b2"
              >
                and monitor their transactions in real-time
              </Text>
            </View>
          </Row>
          <Spacer value={scale(40)} />
          <Row
            alignItems="center"
            style={{ paddingRight: 60 }}
            testID="Second_Option"
          >
            <View style={styles.icon}>
              <TrackAMBIcon />
            </View>
            <Spacer horizontal value={24} />
            <View style={{ paddingRight: 60 }}>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.smokyBlack}
              >
                Track AMB price,
              </Text>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color="#a1a6b2"
              >
                get insights and make better investment decisions
              </Text>
            </View>
          </Row>
          <Spacer value={scale(40)} />
          <Row
            alignItems="center"
            style={{ paddingRight: 60 }}
            testID="Third_Option"
          >
            <View style={styles.icon}>
              <ManageCollections />
            </View>
            <Spacer horizontal value={scale(24)} />
            <View style={{ paddingRight: 50 }}>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.smokyBlack}
              >
                Create and manage collections
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={15}
                  color="#a1a6b2"
                >
                  {' \n'}
                  of addresses for better tracking.
                </Text>
              </Text>
            </View>
          </Row>
        </View>
      </View>
      <Button
        testID="Get_Started_Button"
        onPress={async () => {
          await Cache.setItem(CacheKey.IsSecondInit, true);
          setTimeout(() => {
            navigation.replace('Tabs', { screen: 'Wallets' });
          }, 300);
        }}
        style={styles.getStartedButton}
      >
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.white}
          style={{ paddingVertical: 15 }}
        >
          Get started
        </Text>
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 52,
    height: 52,
    backgroundColor: '#EDF3FF'
  },
  optionsContainer: {
    paddingRight: 60,
    paddingLeft: scale(24)
  },
  getStartedButton: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.deepBlue,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 30
  }
});
