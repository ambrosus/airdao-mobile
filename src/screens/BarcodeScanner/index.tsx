import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BarCodeScanningResult, Camera, CameraType } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { RootStackParamsList } from '@appTypes';
import { Button, Row, Text } from '@components/base';
import { Header } from '@components/composite';
import { CloseIcon, WalletConnectIcon } from '@components/svg/icons';
import { QRCodeIcon } from '@components/svg/icons/v2';
import { ScanSquare } from '@components/templates/BarcodeScanner/components/ScanSquare';
import { COLORS } from '@constants/colors';
import { useBarcodeScanner } from '@hooks';
import { styles } from './styles';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  'BarcodeScannerScreen'
>;

const MOCK_ADDRESS = 'ethereum:0xF51452e37eEbf3226BcBB25FA4f9F570f176484e';

export const BarcodeScannerScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const {
    params: { onScanned, walletConnectEnabled }
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
      {isCameraVisible && walletConnectEnabled && (
        <View style={styles.footer}>
          <Row alignItems="center" style={styles.footerIconsRow}>
            <View style={styles.iconBox}>
              <WalletConnectIcon color={COLORS.neutral0} scale={0.4} />
            </View>

            <View style={styles.divider} />

            <View style={styles.iconBox}>
              <QRCodeIcon color={COLORS.neutral0} scale={1} />
            </View>
          </Row>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
            align="center"
          >
            {t('wallet.connect.scanner.description')}
          </Text>
        </View>
      )}
    </>
  );
};
