import React, { useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { AirDAOTokenLogo, CheckmarkCircleIcon } from '@components/svg/icons';
import { Spacer, Spinner, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { HomeNavigationProp } from '@appTypes';
import { SharePortfolio } from '@components/templates';
import { BottomSheetRef } from '@components/composite';
import { useSendCryptoContext } from '@contexts';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { styles } from './styles';

export const SendFundsLoading = () => {
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

  const title = loading
    ? `${t('send.funds.sending')} ${amount} ${currency}`
    : error
    ? 'Failed'
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
      <View style={{ paddingHorizontal: scale(24) }}>
        <Text
          align="center"
          color={COLORS.neutral300}
          fontSize={16}
          fontFamily="Inter_600SemiBold"
        >
          {t('from')}
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
          {t('to')}
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
                <Text>{t('share')}</Text>
              </SecondaryButton>
              <Spacer value={verticalScale(16)} />
            </>
          )}
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
