import React, { ForwardedRef, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { useAddWalletContext } from '@contexts';
import { AddIcon } from '@components/svg/icons';
import { styles } from './styles';
import CirculationIcon from '@components/svg/icons/CirculationIcon';

export const BottomSheetWalletCreateOrImport = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { setWalletName, setMnemonicLength } = useAddWalletContext();

  const navigateToWalletCreate = () => {
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('CreateWalletStep0');
    localRef.current?.dismiss();
  };

  const navigateToImportWallet = () => {
    setWalletName('');
    setMnemonicLength(128);
    navigation.navigate('ImportWallet');
    localRef.current?.dismiss();
  };

  const AddWalletButton = () => (
    <Button
      onPress={navigateToWalletCreate}
      style={{ ...styles.buttonWrapper, backgroundColor: COLORS.brand100 }}
    >
      <AddIcon color={COLORS.brand500} scale={1.9} />
      <Spacer horizontal value={verticalScale(16)} />
      <View>
        <Text
          fontFamily={'Inter_600SemiBold'}
          fontSize={16}
          color={COLORS.brand500}
        >
          {t('button.create.wallet')}
        </Text>
        <Spacer value={verticalScale(4)} />
        <Text fontSize={14} color={COLORS.brand300}>
          {t('button.create.wallet.info')}
        </Text>
      </View>
    </Button>
  );
  const ImportWalletButton = () => (
    <Button
      onPress={navigateToImportWallet}
      style={{ ...styles.buttonWrapper, backgroundColor: COLORS.purple100 }}
    >
      <CirculationIcon />
      <Spacer horizontal value={verticalScale(16)} />
      <View>
        <Text
          fontSize={16}
          color={COLORS.purple600}
          fontFamily={'Inter_600SemiBold'}
        >
          {t('button.import.wallet')}
        </Text>
        <Spacer value={verticalScale(4)} />
        <Text fontSize={14} color={COLORS.purple300}>
          {t('button.import.wallet.info')}
        </Text>
      </View>
    </Button>
  );

  return (
    <BottomSheet ref={localRef} swiperIconVisible height={verticalScale(225)}>
      <View style={styles.buttonContainer}>
        <Spacer value={verticalScale(16)} />
        <AddWalletButton />
        <Spacer value={verticalScale(16)} />
        <ImportWalletButton />
      </View>
    </BottomSheet>
  );
});
