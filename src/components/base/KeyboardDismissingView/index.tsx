import React from 'react';
import { Keyboard, Pressable, ViewProps } from 'react-native';

export function KeyboardDismissingView(props: ViewProps): JSX.Element {
  return <Pressable onPress={() => Keyboard.dismiss()} {...props} />;
}
