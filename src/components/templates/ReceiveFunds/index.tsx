import { useReducer } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { QRCodeWithLogo } from '@components/modular';
import { CheckboxCircleFill } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { Clipboard, moderateScale, verticalScale } from '@utils';
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
      <View style={styles.qrCode}>
        <QRCodeWithLogo value={address} size={moderateScale(200)} />
      </View>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
        align="center"
      >
        {address}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Text
        align="center"
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={COLORS.foregroundSecondaryContent}
      >
        Send assets only on the AirDAO network
      </Text>

      <Button
        style={{
          ...styles.copyBtn,
          backgroundColor: copied ? COLORS.neutral0 : '#E9EFFB'
        }}
        disabled={copied}
        onPress={copyAddress}
      >
        <Row>
          {copied && (
            <>
              <CheckboxCircleFill />
              <Spacer value={8} horizontal />
            </>
          )}
          <Text
            color={COLORS.brand600}
            fontSize={17}
            fontFamily="Inter_600SemiBold"
          >
            {t(copied ? 'common.copied' : 'common.copy')}
          </Text>
        </Row>
      </Button>
    </View>
  );
};
