import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BarCodeScanningResult, Camera, CameraType } from 'expo-camera';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { RootStackParamsList } from '@appTypes';
import { Button, Row, Text } from '@components/base';
import { Header } from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { ScanSquare } from '@components/templates/BarcodeScanner/components/ScanSquare';
import { styles } from '@components/templates/BarcodeScanner/styles';
import { COLORS } from '@constants/colors';
import { useBarcodeScanner } from '@hooks';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  'BarcodeScannerScreen'
>;

const MOCK_ADDRESS =
  'wc:0e5ba2a00872e925cd2b8ccb4dfd262f22b82ba26e5654eedf3a865bc75fc8b6@2?expiryTimestamp=1736850915&relay-protocol=irn&symKey=d8db36573577231e9a49850410a335aa8b582a33c6c98216636793f5ef44053d';

export const BarcodeScannerScreen = ({ navigation, route }: Props) => {
  const {
    params: { onScanned }
  } = route;
  const { top: topInset } = useSafeAreaInsets();
  const {
    cameraContainerRef,
    hasCameraPermission,
    getCameraPermissions,
    onCameraReadyHandle,
    onCameraLayoutHandle,
    cameraContainerStyle,
    ratio
  } = useBarcodeScanner();

  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const handleBarCodeScanned = useCallback(
    (result: BarCodeScanningResult) => onScanned(result.data),
    [onScanned]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsCameraVisible(true), 500);

    return () => clearTimeout(timeoutId);
  }, []);

  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (!hasCameraPermission) {
    return (
      <SafeAreaView
        style={styles.container}
        onLayout={onCameraLayoutHandle}
        testID="BarcodeScanner_Container"
      >
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button
              testID="BarcodeScanner_Close_Button"
              onPress={navigation.goBack}
            >
              <CloseIcon color={COLORS.neutral800} />
            </Button>
          }
        />
        <View style={[styles.noAccessContainer, { marginTop: -topInset }]}>
          <Row justifyContent="center">
            <Text>No access to camera</Text>
          </Row>
          <Button
            style={styles.getAccessBtn}
            type="circular"
            onPress={getCameraPermissions}
          >
            <Text fontFamily="Inter_600SemiBold" color={COLORS.neutral0}>
              Give permission
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {isCameraVisible && (
        <Camera
          testID="BarcodeScanner_Container"
          ref={cameraContainerRef}
          type={CameraType.back}
          style={cameraContainerStyle}
          onBarCodeScanned={handleBarCodeScanned}
          onCameraReady={onCameraReadyHandle}
          ratio={ratio}
        >
          <Header
            style={{ backgroundColor: 'transparent', marginTop: topInset }}
            backIconVisible={false}
            contentLeft={
              <Button
                testID="BarcodeScanner_Close_Button"
                onPress={navigation.goBack}
                style={{ zIndex: 1000 }}
              >
                <CloseIcon color={COLORS.neutral0} />
              </Button>
            }
            title={<Text color={COLORS.neutral0}>Scan QR code</Text>}
            titlePosition="center"
          />
          {__DEV__ && (
            <View>
              <Button onPress={() => onScanned(MOCK_ADDRESS)}>
                <Text color={COLORS.success400}>
                  Submit successfull address
                </Text>
              </Button>
              <Button onPress={() => onScanned('failing address')}>
                <Text color={COLORS.error400}>Submit failing address</Text>
              </Button>
            </View>
          )}
          <ScanSquare />
        </Camera>
      )}
    </>
  );
};
