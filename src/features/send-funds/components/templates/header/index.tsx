import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Button, Text } from '@components/base';
import { Header } from '@components/composite';
import { BarcodeScannerIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useBarcode } from '@features/send-funds/lib/hooks';
import { StringUtils } from '@utils';

interface FundsHeaderProps {
  sender: string;
}

export const FundsHeader = ({ sender }: FundsHeaderProps) => {
  const { t } = useTranslation();

  const { onShowBarcodeContainer } = useBarcode();

  const renderHeaderTitle = useMemo(
    () => (
      <View>
        <Text
          align="center"
          fontSize={17}
          color={COLORS.neutral800}
          fontFamily="Inter_600SemiBold"
        >
          {t('account.actions.send')}
        </Text>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          {StringUtils.formatAddress(sender, 5, 6)}
        </Text>
      </View>
    ),
    [sender, t]
  );

  const renderHeaderContentRight = useMemo(
    () => (
      <Button onPress={onShowBarcodeContainer}>
        <BarcodeScannerIcon />
      </Button>
    ),
    [onShowBarcodeContainer]
  );

  return (
    <>
      <Header
        bottomBorder
        style={styles.header}
        title={renderHeaderTitle}
        contentRight={renderHeaderContentRight}
      />

      {/*<FundsBarcodeScanner*/}
      {/*  ref={barcodeScannerContainerRef}*/}
      {/*  onClose={onDismissBarcodeContainer}*/}
      {/*  onScanned={onScannedAddress}*/}
      {/*/>*/}
    </>
  );
};
