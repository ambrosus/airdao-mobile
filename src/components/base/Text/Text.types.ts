import { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
export enum FontSizeKey {
  subtext = 'subtext',
  subtitle = 'subtitle',
  title = 'title',
  heading = 'heading'
}
export type FontFamily =
  | 'Inter_400Regular'
  | 'Inter_500Medium'
  | 'Inter_600SemiBold'
  | 'Inter_700Bold'
  | 'Mersad_600SemiBold'
  | 'Mersad_800Bold'
  | 'Mersad_900ExtraBold';

export type FontWeight =
  | 'normal'
  | 'semi-bold'
  | 'bold'
  | 'bolder'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

type FontSizeProps = {
  [key in FontSizeKey]?: boolean;
};

export type TextProps = FontSizeProps & {
  style?: StyleProp<TextStyle>;
  color?: string;
  fontSize?: number;
  opacity?: number;
  children?: ReactNode;
  fontWeight?: FontWeight;
  fontFamily?: FontFamily;
  align?: TextStyle['textAlign'];
  onPress?: () => unknown;
  testID?: string;
  numberOfLines?: number;
};
