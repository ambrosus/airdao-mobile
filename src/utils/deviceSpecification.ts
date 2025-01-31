import { DEVICE_HEIGHT } from '@constants/variables';
import { isAndroid } from './isPlatform';

const smallScreenHeight = [667, 812];

const minimum = Math.max(...smallScreenHeight);

export const isSmallScreen = DEVICE_HEIGHT <= minimum;
export const isAndroidXsScreen = DEVICE_HEIGHT <= 761 && isAndroid;
