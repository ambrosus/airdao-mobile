import { ReactNode } from 'react';
export enum FontSizeKey {
  subtext = 'subtext',
  subtitle = 'subtitle',
  title = 'title',
  heading = 'heading'
}

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
  color?: string;
  fontSize?: number;
  children?: ReactNode;
  fontWeight?: FontWeight;
};
