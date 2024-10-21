import { DEVICE_WIDTH } from '@constants/variables';
import { scale } from '@utils/scaling';

export const CHART_WIDTH = DEVICE_WIDTH - 32;
export const CHART_HEIGHT = 200;
export const CHART_Y_AXIS_INTERVAL = 0.001;

// Tooltip
export const RECT_WIDTH = scale(162);
export const RECT_HEIGHT = 104;
export const TRIANGLE_WIDTH = 10;
export const TRIANGLE_HEIGHT = 10;
