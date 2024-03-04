import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { QRCodeWithLogo } from '@components/modular';
import { Clipboard } from '@utils/clipboard';
import { styles } from './styles';

interface ReceiveFundsProps {
  address: string;
}
export const ReceiveFunds = (props: ReceiveFundsProps) => {
  const { address } = props;
  const { t } = useTranslation();
  const [copied, toggleCopied] = useReducer((flag) => !flag, false);

  const copyAddress = async () => {
    await Clipboard.copyToClipboard(address);
    toggleCopied();
    setTimeout(() => {
      toggleCopied();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('receive.funds')}
      </Text>
      <View style={styles.ambNetworkOnly}>
        <Text
          align="center"
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral400}
        >
          {t('receive.funds.amb.network.only')}
        </Text>
      </View>
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
      <Button
        style={{
          ...styles.copyBtn,
          backgroundColor: copied ? COLORS.success100 : COLORS.alphaBlack5
        }}
        disabled={copied}
        onPress={copyAddress}
      >
        <Text
          color={copied ? COLORS.success600 : COLORS.neutral900}
          fontSize={14}
          fontFamily="Inter_500Medium"
        >
          {t(copied ? 'common.copied' : 'common.copy')}
        </Text>
      </Button>
    </View>
  );
};
