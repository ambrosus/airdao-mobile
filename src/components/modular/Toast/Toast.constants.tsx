import React, { ReactElement } from 'react';
import { Spinner } from '@components/base';
import { InfoIcon, QuestionMarkIcon, WarningIcon } from '@components/svg/icons';
import { CheckboxCircleFill } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { ToastType } from './Toast.types';

export const ToastBg: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.warning100,
  [ToastType.Failed]: COLORS.neutral0,
  [ToastType.Success]: COLORS.neutral0,
  [ToastType.Information]: COLORS.brand100,
  [ToastType.Loading]: COLORS.neutral0
};

export const ToastBorderColor: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.warning200,
  [ToastType.Failed]: COLORS.neutral200,
  [ToastType.Success]: COLORS.neutral200,
  [ToastType.Information]: COLORS.brand200,
  [ToastType.Loading]: COLORS.neutral200
};

export const ToastStatusIcon: { [key in ToastType]: ReactElement } = {
  [ToastType.Highlight]: <WarningIcon />,
  [ToastType.Failed]: <InfoIcon scale={0.5} />,
  [ToastType.Success]: (
    <CheckboxCircleFill color={COLORS.success500} scale={1} />
  ),

  [ToastType.Information]: <QuestionMarkIcon />,
  [ToastType.Loading]: <Spinner />
};
export const TOAST_DEFAULT_DURATION = 2500;
