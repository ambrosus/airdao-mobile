import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const SCREEN_HEIGHT = verticalScale(guidelineBaseHeight);
const SCREEN_WIDTH = scale(guidelineBaseWidth);
export { scale, verticalScale, moderateScale, SCREEN_WIDTH, SCREEN_HEIGHT };
