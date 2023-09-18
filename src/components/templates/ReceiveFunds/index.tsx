import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import {
  QRCodeWithLogo,
  Toast,
  ToastPosition,
  ToastType
} from '@components/modular';
import { Clipboard } from '@utils/clipboard';

interface ReceiveFundsProps {
  address: string;
}
export const ReceiveFunds = (props: ReceiveFundsProps) => {
  const { address } = props;
  const { t } = useTranslation();

  const copyAddress = () => {
    Toast.show({
      text: t('copied.to.clipboard'),
      type: ToastType.Success,
      position: ToastPosition.Top
    });
    Clipboard.copyToClipboard(address);
  };

  return (
    <View style={styles.container}>
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('receive.funds')}
      </Text>
      <View style={styles.qrCode}>
        <QRCodeWithLogo value={address} size={moderateScale(200)} />
      </View>
      <Button activeOpacity={1} onLongPress={copyAddress}>
        <Text
          fontSize={18}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
          align="center"
        >
          {address}
        </Text>
      </Button>
      <Spacer value={verticalScale(16)} />
      <Button style={styles.shareBtn}>
        <Text
          color={COLORS.neutral900}
          fontSize={16}
          fontFamily="Inter_600SemiBold"
        >
          {t('share')}
        </Text>
      </Button>
    </View>
  );
};
