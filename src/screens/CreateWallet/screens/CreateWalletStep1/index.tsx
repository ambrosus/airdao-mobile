import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { MnemonicUtils } from '@utils/mnemonics';
import { useAddWalletContext } from '@contexts';
import { verticalScale, scale } from '@utils/scaling';
import { AlertBanner, PrimaryButton, ToastType } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { styles } from './Step1.styles';

export const CreateWalletStep1 = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [loading, setLoading] = useState(false);
  const { walletMnemonic, mnemonicLength, setWalletMnemonic } =
    useAddWalletContext();
  const walletMnemonicArray = walletMnemonic.split(' ');
  const { t } = useTranslation();
  const columnNumber = 2;

  const init = async () => {
    setLoading(true);
    // create mnemonic
    // tslint:disable-next-line:no-shadowed-variable
    const walletMnemonic = (
      await MnemonicUtils.generateNewMnemonic(mnemonicLength)
    ).mnemonic;
    setWalletMnemonic(walletMnemonic);
    setLoading(false);
  };

  useEffect(() => {
    if (mnemonicLength > 0) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonicLength]);

  const renderWord = (word: string, index: number) => {
    const isNeedSideBorderRadius = !!((index + 1) % 2);
    const borderRadius = isNeedSideBorderRadius
      ? {
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10
        }
      : {
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10
        };
    return (
      <View
        style={{
          borderLeftWidth: isNeedSideBorderRadius ? 0 : 1,
          borderLeftColor: COLORS.neutral200,
          ...styles.mnemonic,
          ...borderRadius
        }}
        key={index}
      >
        <Text
          color={COLORS.neutral400}
          fontSize={14}
          fontFamily="Inter_600SemiBold"
        >
          {index + 1}
        </Text>
        <Spacer value={scale(8)} horizontal />
        <Text
          align="center"
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.neutral900}
        >
          {word}
        </Text>
      </View>
    );
  };

  const onNextPress = () => {
    navigation.navigate('CreateWalletStep2');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header
        style={{ shadowColor: 'transparent' }}
        bottomBorder
        title={
          <Text
            align="center"
            fontSize={scale(18)}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral900}
          >
            {t('create.wallet.recovery.phrase')}
          </Text>
        }
      />
      <Spacer value={scale(23)} />
      <View style={{ paddingHorizontal: scale(28) }}>
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral900}
        >
          {t('create.wallet.verify.text')}
        </Text>
      </View>
      {loading && (
        <View style={styles.loading}>
          <Spinner size="large" />
        </View>
      )}
      <Spacer value={verticalScale(40)} />
      <View style={styles.innerContainer}>
        <FlatList
          data={walletMnemonicArray}
          bounces={false}
          showsVerticalScrollIndicator={false}
          numColumns={columnNumber}
          keyExtractor={(word, idx) => `${word}-${idx}`}
          renderItem={(args) => renderWord(args.item, args.index)}
          ItemSeparatorComponent={() => <Spacer value={verticalScale(24)} />}
        />
        <View>
          <AlertBanner
            text={t('create.wallet.verification.alert')}
            type={ToastType.Highlight}
          />
          <Spacer value={verticalScale(34)} />
          <BottomAwareSafeAreaView paddingBottom={verticalScale(18)}>
            <PrimaryButton onPress={onNextPress}>
              <Text color={COLORS.neutral0}>
                {t('create.wallet.verify.phrase')}
              </Text>
            </PrimaryButton>
          </BottomAwareSafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};
