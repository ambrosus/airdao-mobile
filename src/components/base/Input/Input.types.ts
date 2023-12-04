import { TextInputProps as RNTextInputProps } from 'react-native';
export type ButtonType = 'text' | 'number';

export type TextInputProps = {
  value?: string;
  placeholder?: string;
  focusedStyles?: RNTextInputProps['style'];
  onChangeValue?: (newValue: string) => unknown;
};

export type InputProps = Omit<TextInputProps, 'onChangeText'> &
  RNTextInputProps & {
    type?: ButtonType;
  };

export type InputRef = {
  /**
   * focuses on input
   */
  focus: () => void;

  /**
   * removes focus from input
   */
  blur: () => void;
  /**
   * cleares the input
   */
  clear: () => void;

  /**
   *
   * @param text - sets text of input to given text
   */
  setText: (text: string) => void;
};
