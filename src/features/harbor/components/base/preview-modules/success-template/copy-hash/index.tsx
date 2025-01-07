import React from 'react';
import { Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { contentBox } from '@components/styles';
import { GlobeIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { scale, StringUtils } from '@utils';
import { styles } from './styles';

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
      <Row alignItems="center" justifyContent="center" style={contentBox}>
        <GlobeIcon color={COLORS.neutral600} />
        <Text color={COLORS.neutral500} fontSize={scale(12)}>
          {' '}
          {t('common.transaction')}{' '}
        </Text>
        <Text fontSize={scale(12)} style={styles.hash}>
          {' '}
          {StringUtils.formatAddress(hash, 10, 0)}
        </Text>
      </Row>
    </Pressable>
  );
};
