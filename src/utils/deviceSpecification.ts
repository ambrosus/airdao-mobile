import { DEVICE_HEIGHT } from '@constants/variables';

const smallScreenHeight = [667, 812];

export const isSmallScreen = smallScreenHeight.includes(DEVICE_HEIGHT);
