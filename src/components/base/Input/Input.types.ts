import { TextInputProps as RNTextInputProps } from 'react-native';
export type ButtonType = 'text' | 'number';

export type TextInputProps = {
  value?: string;
  placeholder?: string;
  onChangeValue?: (newValue: string) => unknown;
};

export type InputProps = TextInputProps &
  RNTextInputProps & {
    type?: ButtonType;
  };

export type InputRef = {
  /**
   * focuses on input
   */
  focus: () => void;

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
