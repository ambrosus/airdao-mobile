import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  ViewStyle,
  useWindowDimensions
} from 'react-native';
import { Camera, PermissionStatus } from 'expo-camera';
import { PermissionService } from '@lib';
import { Permission } from '@appTypes';

export function useBarcodeScanner() {
  const { width, height } = useWindowDimensions();
  const [permission] = Camera.useCameraPermissions();

  const cameraContainerRef = useRef<Camera>(null);

  const [cameraContainerHeight, setCameraContainerHeight] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const [isRatioSet, setIsRatioSet] = useState(false);

  const SCREEN_RATIO = height / width;

  const getCameraPermissions = async () => {
    const granted = await PermissionService.getPermission(Permission.Camera, {
      requestAgain: true,
      openSettings: true
    });

    setHasCameraPermission(granted);
  };

  useEffect(() => {
    const showRequestAlert = async () => {
      const _containerHeight = Math.floor(cameraContainerHeight);
      const _windowHeight = Math.floor(cameraContainerHeight);

      if (permission && permission?.status === PermissionStatus.GRANTED) {
        return setHasCameraPermission(true);
      }

      if (_containerHeight === _windowHeight) {
        const timeoutId = setTimeout(() => {
          getCameraPermissions();
        }, 525);

        return () => clearTimeout(timeoutId);
      }
    };

    showRequestAlert();
  }, [cameraContainerHeight, height, permission]);

  const onCameraLayoutHandle = useCallback(
    (event: LayoutChangeEvent) =>
      setCameraContainerHeight(event.nativeEvent.layout.height),
    []
  );

  const prepareRatio = useCallback(async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios =
        await cameraContainerRef.current?.getSupportedRatiosAsync();
      if (!ratios || ratios.length === 0) return; // Early return if no ratios

      let minDistance = Infinity; // Initialize to a large number
      for (const ratio of ratios) {
        const [widthPart, heightPart] = ratio.split(':').map(Number);
        const realRatio = widthPart / heightPart;
        const distance = SCREEN_RATIO - realRatio;

        // Update desiredRatio if this ratio is a better match
        if (distance >= 0 && distance < minDistance) {
          minDistance = distance;
          desiredRatio = ratio;
        }
      }

      // Calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height -
          (desiredRatio
            ? width /
              (parseInt(desiredRatio.split(':')[0]) /
                parseInt(desiredRatio.split(':')[1]))
            : width)) /
          2
      );
      // Set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  }, [height, width, SCREEN_RATIO]);

  const onCameraReadyHandle = useCallback(async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  }, [isRatioSet, prepareRatio]);

  const cameraContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      flex: 1,
      marginTop: imagePadding,
      marginBottom: imagePadding
    }),
    [imagePadding]
  );

  return {
    cameraContainerRef,
    hasCameraPermission,
    getCameraPermissions,
    onCameraReadyHandle,
    onCameraLayoutHandle,
    cameraContainerHeight,
    imagePadding,
    ratio,
    cameraContainerStyle
  };
}
