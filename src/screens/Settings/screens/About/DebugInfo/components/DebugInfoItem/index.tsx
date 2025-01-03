import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale, StringUtils } from '@utils';
import { styles } from './styles';

interface DebugItemModel {
  id: string;
  data: string;
  name: string;
}

interface IProps {
  item: DebugItemModel;
}

const IDS_TO_CUT = [
  'currentPushToken',
  'pushTokenFromFirebase',
  'pushTokenFromBackend',
  'deviceId'
];
export const DebugInfoItem = ({ item }: IProps) => {
  const { t } = useTranslation();
  const { name, data } = item;
  const dataToRender = IDS_TO_CUT.includes(item.id)
    ? StringUtils.formatAddress(data, 15, 15)
    : data;
  const copyData = async () => {
    Toast.show({
      text: `${name} ${t('common.copied')}`,
      position: ToastPosition.Top,
      type: ToastType.Success
    });
    await Clipboard.setStringAsync(data);
  };
  return (
    <TouchableOpacity onPress={copyData} style={styles.main}>
      <Text color={COLORS.neutral700} fontSize={scale(12)}>
        {name}
      </Text>
      <Spacer value={scale(5)} />
      <Text color={COLORS.neutral900} fontSize={scale(14)}>
        {dataToRender}
      </Text>
    </TouchableOpacity>
  );
};
