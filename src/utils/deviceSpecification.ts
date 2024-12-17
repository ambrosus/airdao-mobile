import { DEVICE_HEIGHT } from '@constants/variables';

const smallScreenHeight = [667, 812];

const minimum = Math.max(...smallScreenHeight);

export const isSmallScreen = DEVICE_HEIGHT <= minimum;
