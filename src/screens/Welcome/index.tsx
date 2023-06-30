import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Spacer, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { TabsParamsList } from '@appTypes';
import { Cache, CacheKey } from '@utils/cache';
import {
  BellIconWelcome,
  ListIcon,
  LogoWithNameIcon,
  SwapIcon
} from '@components/svg/icons';

interface CardContent {
  icon: React.ReactNode;
  title: string;
}

const cards: CardContent[] = [
  { title: 'Watch addresses and get alerts', icon: <SwapIcon /> },
  { title: 'Track AMB price with one tap', icon: <BellIconWelcome /> },
  { title: 'Group addresses for better insights', icon: <ListIcon /> }
];

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TabsParamsList>>();

  const renderCard = (content: CardContent, idx: number) => {
    return (
      <View
        key={content.title}
        style={[styles.card, idx !== 0 && { marginTop: verticalScale(24) }]}
      >
        <View style={styles.cardIcon}>{content.icon}</View>
        <Spacer value={verticalScale(16)} />
        <Text
          fontSize={18}
          fontWeight="600"
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral900}
        >
          {content.title}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View>
        <Spacer value={verticalScale(80)} />
        <View style={{ alignSelf: 'center' }}>
          <LogoWithNameIcon />
        </View>
        <Spacer value={verticalScale(68)} />
        {cards.map(renderCard)}
      </View>

      <LinearGradient
        // Button Linear Gradient
        colors={[COLORS.blue500, COLORS.blue600]}
        style={styles.getStartedButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.5, 1]}
      >
        <Button
          onPress={async () => {
            await Cache.setItem(CacheKey.IsSecondInit, true);
            setTimeout(() => {
              navigation.replace('Tabs', { screen: 'Wallets' });
            }, 300);
          }}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.white}
          >
            Get started
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.culturedWhite
  },
  card: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    alignItems: 'center'
  },
  cardIcon: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: COLORS.blue100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  getStartedButton: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.deepBlue,
    borderRadius: moderateScale(24),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(44)
  }
});
