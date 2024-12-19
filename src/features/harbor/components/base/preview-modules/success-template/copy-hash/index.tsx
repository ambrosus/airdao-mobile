import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Row, Text } from '@components/base';
import { GlobeIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { contentBox } from '@components/styles';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { scale, StringUtils } from '@utils';

interface CopyHashModel {
  hash: string;
}

export const CopyHash = ({ hash }: CopyHashModel) => {
  const { t } = useTranslation();
  const onTxPress = async () => {
    Toast.show({
      text: t('common.copied'),
      position: ToastPosition.Top,
      type: ToastType.Success
    });
    await Clipboard.setStringAsync(hash);
  };

  return (
    <Pressable onPress={onTxPress}>
      <Row style={contentBox}>
        <GlobeIcon color={COLORS.neutral600} />
        <Text fontSize={scale(12)}>{t('common.transaction')}</Text>
        <Text
          fontSize={scale(12)}
          style={{
            textDecorationLine: 'underline',
            color: COLORS.neutral900
          }}
        >
          {' '}
          {StringUtils.formatAddress(hash, 10, 0)}
        </Text>
      </Row>
    </Pressable>
  );
};
