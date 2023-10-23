import React, { ReactElement } from 'react';
import { Image } from 'react-native';
import { InfoIcon, QuestionMarkIcon, WarningIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { Spinner } from '@components/base';
import { moderateScale } from '@utils/scaling';
import { ToastType } from './Toast.types';

export const ToastBg: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.warning100,
  [ToastType.Failed]: COLORS.error100,
  [ToastType.Success]: COLORS.success100,
  [ToastType.Information]: COLORS.brand100,
  [ToastType.Loading]: COLORS.neutral0
};

export const ToastBorderColor: { [key in ToastType]: string } = {
  [ToastType.Highlight]: COLORS.warning200,
  [ToastType.Failed]: COLORS.error200,
  [ToastType.Success]: COLORS.success200,
  [ToastType.Information]: COLORS.brand200,
  [ToastType.Loading]: COLORS.neutral200
};

export const ToastStatusIcon: { [key in ToastType]: ReactElement } = {
  [ToastType.Highlight]: <WarningIcon />,
  [ToastType.Failed]: <InfoIcon />,
  [ToastType.Success]: (
    <Image
      source={require('@assets/icons/checkmark-circle.png')}
      style={{
        height: moderateScale(20),
        width: moderateScale(20),
        tintColor: COLORS.success400
      }}
    />
  ),

  [ToastType.Information]: <QuestionMarkIcon />,
  [ToastType.Loading]: <Spinner />
};
