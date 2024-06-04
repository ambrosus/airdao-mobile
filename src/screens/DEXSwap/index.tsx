import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';

export const DEXSwapScreen = () => {
  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flex: 1,
      paddingHorizontal: 20
    };
  }, []);

  return (
    <SafeAreaView style={containerStyle}>
      <Text>Swap</Text>
    </SafeAreaView>
  );
};
