import { RefObject, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { ethereumAddressRegex, walletConnectWsURL } from '@constants/regex';

export function useBarcode(
  barcodeScannerContainerRef: RefObject<BottomSheetRef>,
  onWalletConnectAction: (address: string) => void
) {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();

  const scannedRef = useRef(false);

  const onDismissBarcodeContainer = useCallback(
    () => barcodeScannerContainerRef.current?.dismiss(),
    [barcodeScannerContainerRef]
  );

  const onShowBarcodeContainer = useCallback(
    () => barcodeScannerContainerRef.current?.show(),
    [barcodeScannerContainerRef]
  );

  const onScannedAddress = useCallback(
    (address: string) => {
      onDismissBarcodeContainer();
      const isAddress = ethereumAddressRegex.test(address);

      if (address.startsWith(walletConnectWsURL)) {
        onWalletConnectAction(address);
      } else if (isAddress) {
        navigation.navigate('AddressSearch', { address });
      } else {
        if (!scannedRef.current) {
          scannedRef.current = true;
          Alert.alert(t('alert.invalid.qr.code.msg'), '', [
            {
              text: t('alert.scan.again.msg'),
              onPress: () => {
                scannedRef.current = false;
              }
            }
          ]);
        }
      }
    },
    [
      navigation,
      onDismissBarcodeContainer,
      onWalletConnectAction,
      scannedRef,
      t
    ]
  );

  return {
    onDismissBarcodeContainer,
    onShowBarcodeContainer,
    onScannedAddress
  };
}
