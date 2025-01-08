import { useCallback } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeParamsList, RootStackParamsList, TabsParamsList } from '@appTypes';
import { ethereumAddressRegex } from '@constants/regex';
import { useSendFundsStore } from '@features/send-funds/model';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HomeParamsList & RootStackParamsList>
>;

export function useBarcode() {
  const navigation: Navigation = useNavigation();
  const { state, onChangeState } = useSendFundsStore();

  const onDismissBarcodeContainer = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);

  const onScannedAddress = useCallback(
    (address: string) => {
      onDismissBarcodeContainer();
      const isAddress = ethereumAddressRegex.test(address);
      const extractedAddress = address.match(ethereumAddressRegex)?.[0];

      if (isAddress) {
        onChangeState({
          ...state,
          to: extractedAddress
        });
      }
    },
    [onChangeState, onDismissBarcodeContainer, state]
  );

  const onShowBarcodeContainer = useCallback(
    () =>
      navigation.navigate('BarcodeScannerScreen', {
        onScanned: onScannedAddress
      }),
    [navigation, onScannedAddress]
  );

  return {
    onScannedAddress,
    onDismissBarcodeContainer,
    onShowBarcodeContainer
  };
}
