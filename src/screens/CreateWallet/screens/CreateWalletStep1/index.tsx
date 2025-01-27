import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';

import { useAddWalletStore } from '@features/add-wallet';
import { scale, verticalScale, MnemonicUtils } from '@utils';
import { styles } from './Step1.styles';

const LIST_COLUMNS = 2;

export const CreateWalletStep1 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { mnemonic, mnemonicLength, onChangeMnemonic } = useAddWalletStore();
  const [loading, setLoading] = useState(false);

  const walletMnemonicArray = useMemo(() => mnemonic.split(' '), [mnemonic]);

  const init = async () => {
    setLoading(true);
    // create mnemonic
    // tslint:disable-next-line:no-shadowed-variable
    const walletMnemonic = (
      await MnemonicUtils.generateNewMnemonic(mnemonicLength)
    ).mnemonic;
    onChangeMnemonic(walletMnemonic);
    setLoading(false);
  };

  useEffect(() => {
    if (mnemonicLength > 0) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonicLength]);

  const borderRadiusByIndex = useCallback(
    (index: number): StyleProp<ViewStyle> => {
      if (index % 2 !== 0) {
        return {
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderLeftWidth: 0.5,
          borderLeftColor: COLORS.neutral200
        };
      }

      return {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
      };
    },
    []
  );

  const renderMnemonicWordListItem = useCallback(
    (args: ListRenderItemInfo<string>) => {
      return (
        <View style={[styles.mnemonic, borderRadiusByIndex(args.index)]}>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral400}
          >
            {args.index + 1}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
          >
            {args.item}
          </Text>
        </View>
      );
    },
    [borderRadiusByIndex]
  );

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
            {t('button.create.wallet')}
          </Text>
        }
      />
      <Spacer value={scale(23)} />
      <View style={{ paddingHorizontal: scale(28) }}>
        <Text
          fontSize={15}
          align="center"
          fontFamily="Inter_400Regular"
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
      <Spacer value={verticalScale(24)} />
      <View style={styles.innerContainer}>
        <FlatList
          data={walletMnemonicArray}
          bounces={false}
          showsVerticalScrollIndicator={false}
          numColumns={LIST_COLUMNS}
          keyExtractor={(word, idx) => `${word}-${idx}`}
          renderItem={renderMnemonicWordListItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
        <View>
          <Spacer value={verticalScale(34)} />
          <BottomAwareSafeAreaView paddingBottom={verticalScale(18)}>
            <PrimaryButton onPress={onNextPress}>
              <Text color={COLORS.neutral0}>{t('button.continue')}</Text>
            </PrimaryButton>
          </BottomAwareSafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};
