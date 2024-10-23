import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarCodeScanningResult, Camera, CameraType } from 'expo-camera';
import { Button, Row, Text } from '@components/base';
import { Header } from '@components/composite';
import { CloseIcon } from '@components/svg/icons';
import { PermissionService } from '@lib';
import { Permission } from '@appTypes';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface BarCodeScanner {
  onScanned: (data: any) => unknown;
  onClose: () => unknown;
}

export const BarcodeScanner = (props: BarCodeScanner): JSX.Element => {
  const { onScanned, onClose } = props;
  const { top: topInset } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [hasPermission, setHasPermission] = useState(false);
  const camera = useRef<Camera>(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  const getCameraPermissions = async () => {
    const granted = await PermissionService.getPermission(Permission.Camera, {
      requestAgain: true,
      openSettings: true
    });

    setHasPermission(granted);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getCameraPermissions();
    }, Platform.select({ android: 250, ios: 0, default: 0 }));

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.current?.getSupportedRatiosAsync();
      if (!ratios) return;
      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      const distances = new Map<string, number>();
      const realRatios = new Map<string, number>();
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios.set(ratio, realRatio);
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances.set(ratio, distance);
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < (distances.get(minDistance) || 0)) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance || '4:3';
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - (realRatios.get(desiredRatio) || 1) * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const handleBarCodeScanned = (result: BarCodeScanningResult) => {
    onScanned(result.data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!hasPermission) {
    return (
      <View
        style={{ flex: 1, paddingTop: topInset }}
        testID="BarcodeScanner_Container"
      >
        <Header
          style={{ backgroundColor: 'transparent', zIndex: 1000 }}
          backIconVisible={false}
          contentLeft={
            <Button testID="BarcodeScanner_Close_Button" onPress={onClose}>
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
      </View>
    );
  }

  return (
    <>
      <Camera
        testID="BarcodeScanner_Container"
        ref={camera}
        type={CameraType.back}
        style={{ flex: 1, marginTop: imagePadding, marginBottom: imagePadding }}
        onCameraReady={setCameraReady}
        ratio={ratio}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <Header
          style={{ backgroundColor: 'transparent', marginTop: topInset }}
          backIconVisible={false}
          contentLeft={
            <Button
              testID="BarcodeScanner_Close_Button"
              onPress={onClose}
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
            <Button
              onPress={() =>
                onScanned('0x9FAec9D8CBd3f131b662e3DC586eb0e9B1663b40')
              }
            >
              <Text color={COLORS.success400}>Submit successfull address</Text>
            </Button>
            <Button onPress={() => onScanned('failing address')}>
              <Text color={COLORS.error400}>Submit failing address</Text>
            </Button>
          </View>
        )}
      </Camera>
    </>
  );
};
