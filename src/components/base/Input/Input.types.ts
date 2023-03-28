import { TextInputProps as RNTextInputProps } from 'react-native';
export type ButtonType = 'text' | 'number';

export type TextInputProps = {
  value: string;
  onChangeValue: (newValue: string) => unknown;
};

export type InputProps = TextInputProps &
  RNTextInputProps & {
    type?: ButtonType;
  };
