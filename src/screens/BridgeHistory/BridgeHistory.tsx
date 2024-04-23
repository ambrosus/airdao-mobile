import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

export const BridgeHistory = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  return (
    <SafeAreaView>
      <Text onPress={navigation.goBack}>Bridge history</Text>
    </SafeAreaView>
  );
};
