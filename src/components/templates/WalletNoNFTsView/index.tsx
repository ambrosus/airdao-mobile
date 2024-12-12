import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';

export const WalletNoNFTsView = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.thumbnail}
        source={require('@assets/images/no-nfts-thumb.png')}
      />

      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        No NFTs yet.
      </Text>

      <Text
        fontSize={15}
        color={COLORS.neutral500}
        fontFamily="Inter_400Regular"
        style={styles.description}
      >
        Stay tuned for upcoming events and activities to earn exclusive NFTs.
      </Text>
    </View>
  );
};
