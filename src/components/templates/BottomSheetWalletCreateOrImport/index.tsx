import React, { ForwardedRef, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { AddWalletFlowType, useAddWalletContext } from '@contexts';

export const BottomSheetWalletCreateOrImport = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { setFlowType, setWalletName, setMnemonicLength } =
    useAddWalletContext();

  const navigateToWalletCreate = () => {
    setFlowType(AddWalletFlowType.CREATE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('CreateWalletStep0');
    localRef.current?.dismiss();
  };

  const navigateToImportWallet = () => {
    setFlowType(AddWalletFlowType.RESTORE_WALLET);
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('ImportWallet');
    localRef.current?.dismiss();
  };

  return (
    <BottomSheet ref={localRef} swiperIconVisible height={verticalScale(225)}>
      <View style={{ paddingHorizontal: scale(16) }}>
        <Spacer value={verticalScale(16)} />
        <Text
          align="center"
          fontFamily="Inter_700Bold"
          fontSize={20}
          color={COLORS.neutral800}
        >
          {t('button.add.wallet')}
        </Text>
        <Spacer value={verticalScale(16)} />
        <PrimaryButton onPress={navigateToWalletCreate}>
          <Text
            fontFamily="Inter_500Medium"
            fontSize={16}
            color={COLORS.neutral0}
          >
            {t('button.create.wallet')}
          </Text>
        </PrimaryButton>
        <Spacer value={verticalScale(16)} />
        <Button
          type="circular"
          style={{ backgroundColor: COLORS.alphaBlack5 }}
          onPress={navigateToImportWallet}
        >
          <Text
            align="center"
            fontFamily="Inter_500Medium"
            fontSize={16}
            color={COLORS.neutral800}
            style={{ marginVertical: scale(12) }}
          >
            {t('button.import.wallet')}
          </Text>
        </Button>
      </View>
    </BottomSheet>
  );
});
