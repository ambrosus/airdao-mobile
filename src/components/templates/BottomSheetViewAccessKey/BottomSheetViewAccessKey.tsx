import { ForwardedRef, forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsTabNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { _delayNavigation, scale } from '@utils';
import { styles } from './styles';

interface BottomSheetViewAccessKeyProps extends BottomSheetProps {
  walletHash: string;
  dismiss: () => void;
}
export const BottomSheetViewAccessKey = forwardRef<
  BottomSheetRef,
  BottomSheetViewAccessKeyProps
>((props, ref) => {
  const { t } = useTranslation();
  const { ...bottomSheetProps } = props;
  const { walletHash, dismiss } = props;
  const { bottom: bottomInset } = useSafeAreaInsets();

  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const navigation: SettingsTabNavigationProp = useNavigation();

  const onViewRecoveryPress = async (): Promise<void> => {
    const onPasscodeApprove = () => {
      navigation.navigate('AccessKeys', { walletHash });
    };

    _delayNavigation(dismiss, () =>
      navigation.navigate('Passcode', {
        onPasscodeApprove,
        title: t('singleWallet.warning.button')
      })
    );
  };

  const paddingBottom = useMemo(
    () => (bottomInset === 0 ? 24 : bottomInset * 1.5),
    [bottomInset]
  );

  return (
    <BottomSheet
      ref={localRef}
      title={t('singleWallet.warning.title')}
      avoidKeyboard={false}
      containerStyle={{ paddingBottom }}
      {...bottomSheetProps}
    >
      <View style={styles.innerContainer}>
        <Text
          fontSize={scale(16)}
          fontFamily="Inter_400Regular"
          color={COLORS.neutral800}
        >
          {t('singleWallet.warning.description')}
        </Text>
        <Spacer value={scale(20)} />
        <PrimaryButton onPress={onViewRecoveryPress}>
          <Text
            fontSize={scale(17)}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            {t('singleWallet.warning.button')}
          </Text>
        </PrimaryButton>
      </View>
    </BottomSheet>
  );
});
