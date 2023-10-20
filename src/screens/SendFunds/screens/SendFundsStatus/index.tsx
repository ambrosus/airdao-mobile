import React, { useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { CheckmarkCircleIcon, InfoIcon } from '@components/svg/icons';
import { Spacer, Spinner, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { PrimaryButton, SecondaryButton, TokenLogo } from '@components/modular';
import { HomeNavigationProp } from '@appTypes';
import { SharePortfolio } from '@components/templates';
import { BottomSheetRef } from '@components/composite';
import { useSendCryptoContext } from '@contexts';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { styles } from './styles';

export const SendFundsStatus = () => {
  const { state, reducer } = useSendCryptoContext((v) => v);
  const {
    from,
    to,
    amount = 0,
    currency = AirDAODictTypes.Code.AMB,
    loading,
    error
  } = state;
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const shareModal = useRef<BottomSheetRef>(null);

  let errorMessage = '';
  switch (error?.message) {
    case 'SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_FOR_ANY_FEE': {
      errorMessage = t('send.funds.error.insufficient.balance');
      break;
    }
    case 'SERVER_RESPONSE_NOT_CONNECTED': {
      errorMessage = t('send.funds.error.network');
      break;
    }
    default:
      errorMessage = '';
      break;
  }

  const title = loading
    ? `${t('send.funds.sending')} ${amount} ${currency}`
    : error
    ? t('send.funds.failed')
    : `${amount} ${currency} ${t('send.funds.sent')}!`;

  const onSharePress = () => {
    shareModal.current?.show();
  };

  const navigateToHome = () => {
    navigation.replace('HomeScreen');
    reducer({ type: 'RESET_DATA' });
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ transform: [{ scale: 4 }] }}>
          <TokenLogo token={currency} />
        </View>
      ) : error ? (
        <InfoIcon scale={4} />
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
      {error && !!errorMessage && (
        <>
          <Spacer value={verticalScale(8)} />
          <Text
            color={COLORS.neutral400}
            fontSize={15}
            fontFamily="Inter_400Regular"
          >
            {errorMessage}
          </Text>
        </>
      )}
      <Spacer value={verticalScale(40)} />
      {!error && (
        <View style={{ paddingHorizontal: scale(24) }}>
          <Text
            align="center"
            color={COLORS.neutral300}
            fontSize={16}
            fontFamily="Inter_600SemiBold"
          >
            {t('common.transaction.from')}
          </Text>
          <Text
            align="center"
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
            {t('common.transaction.to')}
          </Text>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            {to}
          </Text>
        </View>
      )}
      {!loading && (
        <View
          style={{
            position: 'absolute',
            bottom: verticalScale(22),
            width: '100%'
          }}
        >
          {!error && (
            <>
              <SecondaryButton onPress={onSharePress} style={styles.button}>
                <Text>{t('button.share')}</Text>
              </SecondaryButton>
              <Spacer value={verticalScale(16)} />
            </>
          )}
          <PrimaryButton onPress={navigateToHome} style={styles.button}>
            <Text color={COLORS.neutral0}>
              {error ? t('send.funds.go.home') : t('common.done')}
            </Text>
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
