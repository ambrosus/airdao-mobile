import { MutableRefObject, RefObject, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { ethereumAddressRegex, walletConnectWsURL } from '@constants/regex';

export function useBarcode(
  barcodeScannerContainerRef: RefObject<BottomSheetRef>,
  onWalletConnectAction: (address: string) => void,
  scannedRef: MutableRefObject<boolean>
) {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
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

      if (isAddress) {
        if (address.startsWith(walletConnectWsURL)) {
          onWalletConnectAction(address);
        } else if (!scannedRef.current) {
          scannedRef.current = true;
          Alert.alert(t('alert.invalid.qr.code.msg'), '', [
            {
              text: t('alert.scan.again.msg'),
              onPress: () => {
                scannedRef.current = false;
              }
            }
          ]);
        } else {
          // Temp non-work solution
          // @ts-ignore
          navigation.navigate('Search', {
            screen: 'SearchScreen',
            params: { address }
          });
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
