import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from '@metamask/react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const SOURCE = { uri: 'https://www.google.com' };

export const BrowserScreen = () => {
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1
    }),
    []
  );

  return (
    <SafeAreaView style={containerStyle}>
      <WebView source={SOURCE} style={containerStyle} />
    </SafeAreaView>
  );
};
