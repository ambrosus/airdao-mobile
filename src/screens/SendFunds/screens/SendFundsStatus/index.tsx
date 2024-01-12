import React, { useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharePortfolio } from '@components/templates';
import { PrimaryButton, SecondaryButton, TokenLogo } from '@components/modular';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { CheckmarkCircleIcon, InfoIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { useSendCryptoContext } from '@contexts';
import { HomeNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

export const SendFundsStatus = () => {
  const { state, reducer } = useSendCryptoContext((v) => v);
  const {
    from,
    to,
    amount = 0,
    currency = AirDAODictTypes.Code.AMB,
    loading,
    error,
    estimatedFee
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
    case 'INSUFFICIENT_FUNDS': {
      errorMessage = t('send.funds.error.insufficient.balance');
      break;
    }
    case 'SERVER_RESPONSE_NOT_CONNECTED': {
      errorMessage = t('send.funds.error.network');
      break;
    }
    case 'PRIVATE_KEY_NOT_FOUND': {
      errorMessage = t('send.funds.error.private.key.not.found');
      break;
    }
    default:
      errorMessage = JSON.stringify(error?.message);
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
    navigation.popToTop();
    reducer({ type: 'RESET_DATA' });
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <TokenLogo token={currency} scale={3} />
      ) : error ? (
        <InfoIcon />
      ) : (
        <CheckmarkCircleIcon />
      )}
      <Spacer value={verticalScale(8)} />
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
            align="center"
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
            txFee={estimatedFee}
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
