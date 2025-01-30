import { DEVICE_HEIGHT } from '@constants/variables';
import { isIos } from './isPlatform';

const smallScreenHeight = [667, 812];

const minimum = Math.max(...smallScreenHeight);

export const isSmallScreen = DEVICE_HEIGHT <= minimum;
export const isExtraSmallScreen = DEVICE_HEIGHT <= 740 && !isIos;
