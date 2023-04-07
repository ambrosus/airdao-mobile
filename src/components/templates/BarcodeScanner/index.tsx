import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Button, Text } from '@components/base';
import { Header } from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BarCodeScanner {
  onScanned: (data: any) => unknown;
  onClose: () => unknown;
}

export const BarcodeScanner = (props: BarCodeScanner): JSX.Element => {
  const { onScanned, onClose } = props;
  const [hasPermission, setHasPermission] = useState(false);
  const { top: topInset } = useSafeAreaInsets();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    onScanned(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        type={CameraType.back}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <Header
          style={{ backgroundColor: 'transparent', marginTop: topInset }}
          backIconVisible={false}
          contentLeft={
            <Button onPress={onClose}>
              <CloseIcon color="#FFFFFF" />
            </Button>
          }
          title={<Text color="#FFFFFF">Scan QR code</Text>}
          titlePosition="center"
        />
      </Camera>
    </>
  );
};
