import { Keyboard, View, ViewProps } from 'react-native';

export function KeyboardDismissingView(
  props: ViewProps & { disabled?: boolean }
): JSX.Element {
  const keyboardDismissProps = props.disabled
    ? {}
    : {
        onStartShouldSetResponder: () => true,
        onResponderRelease: () => Keyboard.dismiss()
      };
  return <View {...keyboardDismissProps} {...props} />;
}
