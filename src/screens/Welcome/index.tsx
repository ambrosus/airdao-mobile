import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from '@appTypes';
import { Cache, CacheKey } from '@utils/cache';

const options = [
  {
    title: 'Add address to your watchlist',
    subtitle: 'and monitor their transactions in real-time'
  },
  {
    title: 'Track AMB price',
    subtitle: 'get insights and make better investment decisions'
  },
  {
    title: 'Create and manage collections',
    subtitle: ' of addresses for better tracking.'
  }
];

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TabsParamsList>>();

  const Icon = () => {
    return <View style={styles.logo} />;
  };

  return (
    <View style={styles.container}>
      <View>
        <Spacer value={41} />
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
        <Spacer value={21} />
        <View style={styles.optionsContainer}>
          <Text
            fontFamily="Inter_700Bold"
            fontSize={24}
            color={COLORS.smokyBlack}
          >
            Experience the ease of tracking addresses on the go!
          </Text>
          <Spacer value={scale(36)} />
          <Row alignItems="center" style={{ paddingRight: 60 }}>
            <Icon />
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
          <Row alignItems="center" style={{ paddingRight: 60 }}>
            <Icon />
            <Spacer horizontal value={scale(24)} />
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
          <Row alignItems="center" style={{ paddingRight: 60 }}>
            <Icon />
            <Spacer horizontal value={scale(24)} />
            <View style={{ paddingRight: 50 }}>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.smokyBlack}
              >
                Create and manage collections
                <Text color="#a1a6b2"> of addresses for better tracking.</Text>
              </Text>
            </View>
          </Row>
        </View>
      </View>
      <Button
        onPress={async () => {
          await Cache.setItem(CacheKey.IsFirstInit, true);
          setTimeout(() => {
            navigation.navigate('Tabs', { screen: 'Wallets' });
          }, 300);
        }}
        style={{
          width: '90%',
          alignSelf: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.deepBlue,
          borderRadius: 24,
          paddingHorizontal: 16,
          marginBottom: 30
        }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, justifyContent: 'space-between' },
  logo: {
    borderRadius: 50,
    width: 52,
    height: 52,
    backgroundColor: '#d9d9d9'
  },
  optionsContainer: { paddingRight: 60, paddingLeft: scale(24), paddingTop: 30 }
});
