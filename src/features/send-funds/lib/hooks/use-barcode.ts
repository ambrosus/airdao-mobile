import { useCallback } from 'react';
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ethereumAddressRegex } from '@constants/regex';
import { useSendFundsStore } from '@features/send-funds/model';
import { HomeParamsList, RootStackParamsList, TabsParamsList } from '@appTypes';

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

      if (isAddress) {
        onChangeState({
          ...state,
          to: address
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
