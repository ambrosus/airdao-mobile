import React, { ReactElement, useEffect, useState } from 'react';
import {
  Text,
  TextStyle,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle
} from 'react-native';
import { Row } from '@components/base';
import { DEVICE_HEIGHT } from '@constants/variables';
import { scale } from '@utils/scaling';
import { FaceIDIcon } from '@components/svg/icons/v2/FaceIDIcon';
import { COLORS } from '@constants/colors';
import { BackIcon } from '@components/svg/icons';
import { DeviceUtils } from '@utils/device';
import { FingerPrintIcon } from '@components/svg/icons/v2/FingerPrintIcon';

const DEFAULT_BUTTONS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['biometric', '0', 'remove']
];

interface PasscodeKeyboardModel {
  buttons?: string[][];
  customBackSpaceIcon?: ReactElement;
  customBiometricIcon?: ReactElement;
  isBiometricEnabled?: boolean;
  buttonContainerStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  onBiometricPress: () => void | Promise<void>;
  onRemove: () => void;
  onButtonPress: (btnTitle: string) => void;
}

export const PasscodeKeyboard = ({
  buttons = DEFAULT_BUTTONS,
  customBackSpaceIcon,
  customBiometricIcon,
  buttonContainerStyle,
  buttonTextStyle,
  isBiometricEnabled = true,
  onBiometricPress,
  onButtonPress,
  onRemove
}: PasscodeKeyboardModel) => {
  const [biometricType, setBiometricType] = useState('');

  useEffect(() => {
    const getBiometric = async () => {
      const hasFaceId = await DeviceUtils.checkFaceIDExists();
      const hasFingerprint = await DeviceUtils.checkFingerprintExists();
      if (hasFaceId) {
        return setBiometricType('face_id');
      }
      if (hasFingerprint) {
        return setBiometricType('fingerprint');
      }
      setBiometricType('none');
    };
    getBiometric().then();
  }, []);

  const isFaceId = biometricType === 'face_id';
  const getButtonFunction = (btnTitle: string) => {
    if (btnTitle === 'biometric' && !isBiometricEnabled) {
      return {
        title: '',
        onPress: () => {
          /// do nothing
        }
      };
    }
    switch (btnTitle) {
      case 'biometric':
        return {
          title: btnTitle,
          onPress: onBiometricPress
        };
      case 'remove':
        return { title: btnTitle, onPress: onRemove };
      default:
        return {
          title: btnTitle,
          onPress: () => onButtonPress(btnTitle)
        };
    }
  };

  const RenderButton = ({ button }: { button: string }) => {
    if (!button) return <></>;
    const { title, onPress } = getButtonFunction(button);

    const isNeedIcon = title === 'remove' || title === 'biometric';
    const getIcon = () => {
      switch (title) {
        case 'remove':
          return (
            customBackSpaceIcon || (
              <BackIcon color={COLORS.neutral900} scale={1.15} />
            )
          );
        case 'biometric':
          return customBiometricIcon || isFaceId ? (
            <FaceIDIcon />
          ) : (
            <FingerPrintIcon />
          );
      }
    };

    const onButtonPress = () => {
      onPress();
      Vibration.vibrate(30);
    };

    return (
      <TouchableOpacity
        onPress={onButtonPress}
        disabled={!title}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '25%',
          margin: 5,
          height: DEVICE_HEIGHT * 0.08,
          ...buttonContainerStyle
        }}
      >
        {isNeedIcon ? (
          getIcon()
        ) : (
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: scale(20),
              ...buttonTextStyle
            }}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: DEVICE_HEIGHT * 0.4,
        alignItems: 'center'
      }}
    >
      {buttons.map((item, index) => {
        return (
          <Row key={`${index}`}>
            {item.map((item, index) => (
              <RenderButton key={`${index}`} button={item} />
            ))}
          </Row>
        );
      })}
    </View>
  );
};
