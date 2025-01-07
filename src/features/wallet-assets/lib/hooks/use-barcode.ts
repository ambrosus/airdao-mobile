import { useCallback, useRef } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { HomeParamsList, RootStackParamsList, TabsParamsList } from '@appTypes';
import { ethereumAddressRegex, walletConnectWsURL } from '@constants/regex';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { walletKit } from '@features/wallet-connect/lib/wc.core';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HomeParamsList & RootStackParamsList>
>;

export function useBarcode() {
  const { t } = useTranslation();
  const navigation: Navigation = useNavigation();
  const { setWalletConnectStep } = useWalletConnectContextSelector();
  const { onShowWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const scannedRef = useRef(false);

  const onDismissBarcodeContainer = useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  const onHandleWalletConnectAuthorization = useCallback(
    async (uri: string): Promise<void> => {
      if (!walletKit) {
        return onDismissBarcodeContainer();
      }

      try {
        InteractionManager.runAfterInteractions(async () => {
          try {
            await walletKit.pair({ uri });
          } catch (error) {
            onDismissBarcodeContainer();
            setWalletConnectStep(CONNECT_VIEW_STEPS.PAIR_EXPIRED_ERROR);

            await new Promise<void>((resolve) => setTimeout(resolve, 1000));

            InteractionManager.runAfterInteractions(
              onShowWalletConnectBottomSheet
            );
          }
        });
      } catch (error) {
        console.error('Error during wallet connection:', error);
        onDismissBarcodeContainer();
      }
    },
    [
      onDismissBarcodeContainer,
      onShowWalletConnectBottomSheet,
      setWalletConnectStep
    ]
  );

  const onScannedAddress = useCallback(
    (address: string) => {
      onDismissBarcodeContainer();
      const isAddress = ethereumAddressRegex.test(address);
      const extractedAddress = address.match(ethereumAddressRegex)?.[0];

      if (address.startsWith(walletConnectWsURL)) {
        onHandleWalletConnectAuthorization(address);
      } else if (isAddress && extractedAddress) {
        navigation.navigate('Explore', {
          address: extractedAddress
        });
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
      onHandleWalletConnectAuthorization,
      t
    ]
  );

  const onShowBarcodeContainer = useCallback(
    () =>
      navigation.navigate('BarcodeScannerScreen', {
        onScanned: onScannedAddress
      }),
    [navigation, onScannedAddress]
  );

  return {
    onDismissBarcodeContainer,
    onShowBarcodeContainer
  };
}
