import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  useWindowDimensions,
  ViewStyle
} from 'react-native';
import { Camera, PermissionStatus } from 'expo-camera';
import { Permission } from '@appTypes';
import { PermissionService } from '@lib';

export function useBarcodeScanner() {
  const { width, height } = useWindowDimensions();
  const [permission] = Camera.useCameraPermissions();

  const cameraContainerRef = useRef<Camera>(null);
  const hasRequestedPermissions = useRef<boolean>(false);

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
      const isAlreadyRequestedPermission = hasRequestedPermissions.current;

      if (permission?.status === PermissionStatus.GRANTED) {
        return setHasCameraPermission(true);
      }

      if (_containerHeight === height && !isAlreadyRequestedPermission) {
        hasRequestedPermissions.current = true;
        const timeoutId = setTimeout(getCameraPermissions, 525);

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
    const calculateRealRatio = (ratio: string) => {
      const parts = ratio.split(':');
      return parseInt(parts[0]) / parseInt(parts[1]);
    };

    const findBestRatio = (ratios: string[]) => {
      const distances = new Map<string, number>();
      let minDistance: string | null = null;

      for (const ratio of ratios) {
        const realRatio = calculateRealRatio(ratio);
        const distance = SCREEN_RATIO - realRatio;
        distances.set(ratio, distance);

        if (
          minDistance === null ||
          (distance >= 0 && distance < (distances.get(minDistance) || 0))
        ) {
          minDistance = ratio;
        }
      }
      return minDistance;
    };

    let desiredRatio = '4:3'; // Start with the system default
    if (Platform.OS === 'android') {
      const ratios =
        await cameraContainerRef.current?.getSupportedRatiosAsync();
      if (!ratios) return;

      desiredRatio = findBestRatio(ratios) || '4:3';
      const realRatio = calculateRealRatio(desiredRatio);
      const remainder = Math.floor((height - realRatio * width) / 2);

      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      setIsRatioSet(true);
    }
  }, [SCREEN_RATIO, height, width]);

  const onCameraReadyHandle = useCallback(async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  }, [isRatioSet, prepareRatio]);

  const cameraContainerStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      flex: 1,
      position: 'relative',
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
