import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AirDAOTokenLogo, CheckmarkCircleIcon } from '@components/svg/icons';
import { Spacer, Spinner, Text } from '@components/base';
import { useTranslation } from 'react-i18next';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { SharePortfolio } from '@components/templates';
import { BottomSheetRef } from '@components/composite';

export const SendFundsLoading = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const loading = false;
  const shareModal = useRef<BottomSheetRef>(null);
  const amount = 1000;
  const currency = 'AMB';
  const from = '0x3ea4085jaei23io350453459opa';
  const to = '0x45ei45o0dae53iuh33i32esaio345';

  const title = loading
    ? `${t('send.funds.sending')} ${amount} ${currency}`
    : `${amount} ${currency} ${t('send.funds.sent')}!`;

  const onSharePress = () => {
    shareModal.current?.show();
  };

  const navigateToHome = () => {
    navigation.replace('HomeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <AirDAOTokenLogo scale={4} />
      ) : (
        <CheckmarkCircleIcon color={COLORS.success300} scale={4} />
      )}
      <Spacer value={verticalScale(56)} />
      <Text color={COLORS.neutral800} fontSize={20} fontFamily="Inter_700Bold">
        {title}
      </Text>
      {loading && (
        <>
          <Spacer value={verticalScale(8)} />
          <Text
            color={COLORS.neutral300}
            fontSize={14}
            fontFamily="Inter_500Medium"
          >
            {t('send.funds.sending.description')}
          </Text>
          <Spacer value={verticalScale(16)} />
          <Spinner />
        </>
      )}
      <Spacer value={verticalScale(40)} />
      <Text
        align="center"
        color={COLORS.neutral300}
        fontSize={16}
        fontFamily="Inter_600SemiBold"
      >
        {t('from')}
      </Text>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {from}
      </Text>
      <Spacer value={verticalScale(24)} />
      <Text
        align="center"
        color={COLORS.neutral300}
        fontSize={16}
        fontFamily="Inter_600SemiBold"
      >
        {t('to')}
      </Text>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {to}
      </Text>
      {!loading && (
        <View
          style={{
            position: 'absolute',
            bottom: verticalScale(22),
            width: '100%'
          }}
        >
          <SecondaryButton onPress={onSharePress} style={styles.button}>
            <Text>{t('share')}</Text>
          </SecondaryButton>
          <Spacer value={verticalScale(16)} />
          <PrimaryButton onPress={navigateToHome} style={styles.button}>
            <Text color={COLORS.neutral0}>{t('common.done')}</Text>
          </PrimaryButton>
          <SharePortfolio
            ref={shareModal}
            title={t('common.transaction')}
            bottomSheetTitle={t('common.share.transaction')}
            balance={amount.toFixed(2)}
            currency={currency}
            currencyPosition={'right'}
            timestamp={new Date()}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
