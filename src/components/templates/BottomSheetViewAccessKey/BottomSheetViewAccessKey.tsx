import React, { ForwardedRef, forwardRef } from 'react';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, PrimaryButton } from '@components/modular';
import { Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { useTranslation } from 'react-i18next';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { SettingsTabNavigationProp } from '@appTypes';
import { useNavigation } from '@react-navigation/native';

interface BottomSheetViewAccessKeyProps extends BottomSheetProps {
  walletHash: string;
  dismiss: () => any;
}
export const BottomSheetViewAccessKey = forwardRef<
  BottomSheetRef,
  BottomSheetViewAccessKeyProps
>((props, ref) => {
  const { ...bottomSheetProps } = props;
  const { walletHash, dismiss } = props;

  const { t } = useTranslation();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const navigation: SettingsTabNavigationProp = useNavigation();

  const onViewRecoveryPress = async (): Promise<void> => {
    dismiss();
    const onPasscodeApprove = () => {
      navigation.navigate('AccessKeys', { walletHash });
    };

    setTimeout(
      () =>
        navigation.navigate('Passcode', {
          onPasscodeApprove,
          title: t('singleWallet.warning.button')
        }),
      500
    );
  };

  return (
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      avoidKeyboard={false}
      containerStyle={styles.main}
      {...bottomSheetProps}
    >
      <Text
        style={styles.title}
        fontFamily="Inter_600SemiBold"
        fontSize={scale(20)}
        color={COLORS.neutral900}
      >
        {t('singleWallet.warning.title')}
      </Text>
      <Spacer value={15} />
      <Text
        fontFamily="Inter_400Regular"
        fontSize={scale(16)}
        color={COLORS.neutral900}
      >
        {t('singleWallet.warning.description')}
      </Text>
      <Spacer value={scale(20)} />
      <PrimaryButton onPress={onViewRecoveryPress}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={scale(17)}
          color={COLORS.neutral0}
        >
          {t('singleWallet.warning.button')}
        </Text>
      </PrimaryButton>
    </BottomSheetFloat>
  );
});
