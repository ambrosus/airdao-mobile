import React from 'react';
import { Keyboard, View, ViewProps } from 'react-native';

export function KeyboardDismissingView(props: ViewProps): JSX.Element {
  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}
      {...props}
    />
  );
}
