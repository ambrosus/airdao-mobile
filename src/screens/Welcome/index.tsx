import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacer, Text } from '@components/base';
import {
  BellIconWelcome,
  ListIcon,
  LogoWithNameIcon,
  SwapIcon
} from '@components/svg/icons';
import { PrimaryButton } from '@components/modular';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { TabsParamsList } from '@appTypes';
import { Cache, CacheKey } from '@utils/cache';

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
      <PrimaryButton
        onPress={async () => {
          await Cache.setItem(CacheKey.IsSecondInit, true);
          navigation.replace('Tabs', { screen: 'Wallets' });
        }}
        style={styles.getStartedButton}
      >
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral0}
        >
          Get started
        </Text>
      </PrimaryButton>
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
    backgroundColor: COLORS.neutral0,
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    alignItems: 'center'
  },
  cardIcon: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brand100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  getStartedButton: {
    marginBottom: verticalScale(44)
  }
});
