import React, { ForwardedRef, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { HomeNavigationProp } from '@appTypes';
import { useAddWalletContext } from '@contexts';
import { styles } from './styles';
import { AddIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import { DownloadIcon } from '@components/svg/icons/v2/settings';

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
    navigation.navigate('ImportWalletMethods');
    localRef.current?.dismiss();
  };

  const AddWalletButton = () => (
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
  );
  const ImportWalletButton = () => (
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
  );

  return (
    <BottomSheet
      containerStyle={styles.buttonContainer}
      ref={localRef}
      swiperIconVisible
      height={verticalScale(225)}
    >
      <Text
        fontFamily={'Inter_600SemiBold'}
        fontSize={scale(20)}
        color={COLORS.neutral900}
      >
        {t('button.add.wallet')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <AddWalletButton />
        <ImportWalletButton />
      </View>
    </BottomSheet>
  );
});
