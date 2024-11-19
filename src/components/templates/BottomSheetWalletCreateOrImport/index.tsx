import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { HomeNavigationProp } from '@appTypes';
import { AddIcon, CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { DownloadIcon } from '@components/svg/icons/v2/settings';
import { useAddWalletStore } from '@features/add-wallet';

export const BottomSheetWalletCreateOrImport = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>((props, ref) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const { onChangeMnemonicLength, onChangeName } = useAddWalletStore();

  const navigateToWalletCreate = useCallback(() => {
    onChangeName('');
    onChangeMnemonicLength(128);
    navigation.navigate('CreateWalletStep0');
    localRef.current?.dismiss();
  }, [localRef, navigation, onChangeMnemonicLength, onChangeName]);

  const navigateToImportWallet = useCallback(() => {
    onChangeName('');
    onChangeMnemonicLength(128);
    navigation.navigate('ImportWalletMethods');
    localRef.current?.dismiss();
  }, [localRef, navigation, onChangeMnemonicLength, onChangeName]);

  const onClose = () => localRef?.current?.dismiss();

  const AddWalletButton = useCallback(
    () => (
      <Button onPress={navigateToWalletCreate} style={styles.buttonWrapper}>
        <View
          style={{
            backgroundColor: COLORS.brand600,
            borderRadius: 50,
            padding: 5
          }}
        >
          <AddIcon color={COLORS.neutral0} scale={1.3} />
        </View>
        <Spacer value={15} />
        <Text
          fontFamily={'Inter_600SemiBold'}
          fontSize={16}
          color={COLORS.neutral900}
        >
          {t('button.create.wallet')}
        </Text>
      </Button>
    ),
    [navigateToWalletCreate, t]
  );

  const ImportWalletButton = useCallback(
    () => (
      <Button onPress={navigateToImportWallet} style={styles.buttonWrapper}>
        <DownloadIcon />
        <Spacer value={15} />
        <Text
          fontFamily={'Inter_600SemiBold'}
          fontSize={16}
          color={COLORS.neutral900}
        >
          {t('import.wallet.common.title')}
        </Text>
      </Button>
    ),
    [navigateToImportWallet, t]
  );

  return (
    <BottomSheet
      containerStyle={styles.buttonContainer}
      ref={localRef}
      swiperIconVisible
      height={verticalScale(225)}
    >
      <View style={styles.titleContainer}>
        <Text
          fontFamily={'Inter_600SemiBold'}
          fontSize={scale(20)}
          color={COLORS.neutral900}
        >
          {t('button.add.wallet')}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon scale={0.7} border />
        </TouchableOpacity>
      </View>
      <Spacer value={verticalScale(16)} />
      <View style={styles.container}>
        <AddWalletButton />
        <ImportWalletButton />
      </View>
    </BottomSheet>
  );
});
