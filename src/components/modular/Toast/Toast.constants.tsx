import { COLORS } from '@constants/colors';
import { ToastType } from './Toast.types';
import React, { ReactElement } from 'react';
import {
  CheckmarkCircleIcon,
  InfoIcon,
  QuestionMarkIcon,
  WarningIcon
} from '@components/svg/icons';
import { Spinner } from '@components/base';

export const ToastBg: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.yellow100,
  [ToastType.Failed]: COLORS.red100,
  [ToastType.Success]: COLORS.teal100,
  [ToastType.Information]: COLORS.blue100,
  [ToastType.Loading]: COLORS.neutral0
};

export const ToastBorderColor: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.yellow200,
  [ToastType.Failed]: COLORS.red200,
  [ToastType.Success]: COLORS.teal200,
  [ToastType.Information]: COLORS.blue200,
  [ToastType.Loading]: COLORS.neutral200
};

export const ToastStatusIcon: { [key in ToastType]: ReactElement } = {
  [ToastType.Highlight]: <WarningIcon />,
  [ToastType.Failed]: <InfoIcon />,
  [ToastType.Success]: <CheckmarkCircleIcon />,
  [ToastType.Information]: <QuestionMarkIcon />,
  [ToastType.Loading]: <Spinner color={COLORS.blue200} />
};
