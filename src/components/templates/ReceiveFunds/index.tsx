import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { QRCodeWithLogo } from '@components/modular';

interface ReceiveFundsProps {
  address: string;
}
export const ReceiveFunds = (props: ReceiveFundsProps) => {
  const { address } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('receive.funds')}
      </Text>
      <View style={styles.qrCode}>
        <QRCodeWithLogo value={address} size={moderateScale(200)} />
      </View>
      <Text
        fontSize={18}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
        align="center"
      >
        {address}
      </Text>
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
