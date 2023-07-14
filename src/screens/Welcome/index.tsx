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
        </Button>
      </LinearGradient>
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
