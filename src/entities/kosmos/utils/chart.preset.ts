import { DEVICE_WIDTH } from '@constants/variables';
import { scale } from '@utils';

export const CHART_WIDTH = DEVICE_WIDTH - 32;
export const CHART_HEIGHT = 200;
export const CHART_Y_AXIS_INTERVAL = 0.001;

// Tooltip
export const RECT_WIDTH = scale(162);
export const RECT_HEIGHT = 104;
export const TRIANGLE_WIDTH = 10;
export const TRIANGLE_HEIGHT = 10;

export const CHART_INTERVALS = [
  { label: '1D', value: 86400000 },
  { label: '3D', value: 259200000 },
  { label: '7D', value: 604800000 },
  { label: '1M', value: 2629800000 },
  { label: '1Y', value: 31556952000 },
  { label: 'All', value: 0 }
];
