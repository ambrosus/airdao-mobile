import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../../Icon.types';
import { COLORS } from '@constants/colors';

export function SettingsInactiveIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const width = 26;
  const height = 26;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      fill="none"
    >
      <Path
        d="M3.58946 17.0007C3.15721 16.252 2.83277 15.4707 2.61133 14.6746C3.5838 14.1784 4.24972 13.1673 4.24972 12.0007C4.24972 10.835 3.5848 9.82449 2.61353 9.3279C3.06025 7.717 3.90857 6.21676 5.11474 4.9905C6.0307 5.58465 7.23935 5.65583 8.24972 5.07249C9.26009 4.48915 9.80277 3.40684 9.7462 2.31653C11.4113 1.88509 13.1347 1.90053 14.7531 2.31911C14.6975 3.40855 15.2401 4.48961 16.2497 5.07249C17.2601 5.65581 18.4687 5.58465 19.3846 4.99056C19.9633 5.58035 20.4777 6.252 20.91 7.0007C21.3422 7.74939 21.6667 8.53074 21.8881 9.32677C20.9156 9.82296 20.2497 10.8341 20.2497 12.0007C20.2497 13.1665 20.9146 14.1769 21.8859 14.6735C21.4392 16.2844 20.5909 17.7846 19.3847 19.0109C18.4687 18.4168 17.2601 18.3456 16.2497 18.9289C15.2393 19.5122 14.6967 20.5946 14.7532 21.6849C13.0882 22.1163 11.3648 22.1009 9.74633 21.6823C9.80191 20.5928 9.25929 19.5118 8.24972 18.9289C7.23938 18.3456 6.03079 18.4167 5.11484 19.0108C4.53617 18.421 4.02172 17.7494 3.58946 17.0007ZM9.24972 17.1969C10.3411 17.827 11.1249 18.8232 11.5003 19.9664C11.9986 20.0138 12.5002 20.0145 12.9986 19.968C13.3738 18.8242 14.1578 17.8273 15.2497 17.1969C16.3416 16.5664 17.597 16.386 18.7752 16.6329C19.0646 16.2245 19.3148 15.7897 19.5229 15.3345C18.7206 14.4378 18.2497 13.2609 18.2497 12.0007C18.2497 10.7405 18.7206 9.56369 19.5229 8.66699C19.4188 8.44099 19.3038 8.21871 19.1779 8.0007C19.052 7.78268 18.917 7.57197 18.7733 7.36891C17.5957 7.61525 16.3411 7.43463 15.2497 6.80454C14.1583 6.17444 13.3746 5.17817 12.9991 4.03504C12.5009 3.98763 11.9992 3.98695 11.5009 4.03341C11.1256 5.1772 10.3416 6.17413 9.24972 6.80454C8.1578 7.43496 6.90245 7.61543 5.72428 7.36852C5.43485 7.7769 5.18463 8.21166 4.97656 8.66686C5.77881 9.5636 6.24972 10.7405 6.24972 12.0007C6.24972 13.2609 5.77883 14.4377 4.97656 15.3344C5.08067 15.5604 5.19564 15.7827 5.32152 16.0007C5.44739 16.2187 5.5824 16.4294 5.72612 16.6325C6.90377 16.3862 8.15838 16.5668 9.24972 17.1969ZM12.2497 15.0007C10.5929 15.0007 9.24972 13.6576 9.24972 12.0007C9.24972 10.3439 10.5929 9.0007 12.2497 9.0007C13.9066 9.0007 15.2497 10.3439 15.2497 12.0007C15.2497 13.6576 13.9066 15.0007 12.2497 15.0007ZM12.2497 13.0007C12.802 13.0007 13.2497 12.553 13.2497 12.0007C13.2497 11.4484 12.802 11.0007 12.2497 11.0007C11.6974 11.0007 11.2497 11.4484 11.2497 12.0007C11.2497 12.553 11.6974 13.0007 12.2497 13.0007Z"
        fill={color}
      />
    </Svg>
  );
}