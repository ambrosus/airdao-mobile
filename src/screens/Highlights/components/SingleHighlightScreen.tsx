import React from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const SingleHighlightScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Header backIconVisible style={{ shadowColor: 'transparent' }} />
        <View style={{ paddingHorizontal: scale(18) }}>
          <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
            AirDAO: Transition to community governance
          </Text>
          <Spacer value={scale(8)} />
          <Text fontFamily="Inter_500Medium" fontSize={12} color={COLORS.nero}>
            2 days ago
          </Text>
          <Spacer value={scale(12)} />
          <Image
            resizeMode="contain"
            source={require('../../../../assets/images/single-highlight.png')}
          />
          <Spacer value={scale(22)} />
          <Text fontFamily="Inter_500Medium" fontSize={16} color="#393b40">
            Since our blockchain launched on April 16th, 2019, the community’s
            support has been instrumental in the growth of the AMB token
            ecosystem. We want to express our gratitude to everyone who has
            contributed to supporting our network over the past four years. We
            thank everyone — from AMB stakers to node operators, FirepotSwap
            users, and more. To community members, past and present, that
            supported us from our early days as Ambrosus through our evolution
            to AirDAO. We cannot thank you all enough.{'\n'}
            {'\n'}
            In light of this, we are excited to announce that we will hold an
            airdrop to celebrate the fourth anniversary of AirDAO’s blockchain.
            Read on to learn more about the airdrop and eligibility criteria.
            {'\n'}
            {'\n'}
            We want to reward active users who’ve contributed to our network.
            Community members that helped the growth of the AMB token ecosystem
            by conducting five specific on-chain activities will be eligible for
            airdrop rewards. The airdrop will start at 12 PM UTC on Sunday,
            April 16th, and finish at 12 PM UTC on Wednesday, April 26th.
            Participating self-hosted wallets must contain a minimum of 1000 AMB
            to take part in the airdrop.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
