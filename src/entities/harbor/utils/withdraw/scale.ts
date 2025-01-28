import { Dimensions } from 'react-native';

const BASE_WIDTH = 360;

export function calculateTextWidth(value: string, fontSize: number): number {
  const { width: screenWidth } = Dimensions.get('window');
  const scaleFactor = screenWidth / BASE_WIDTH;
  const charWidth = fontSize * 0.6 * scaleFactor;
  return value.length * charWidth;
}
