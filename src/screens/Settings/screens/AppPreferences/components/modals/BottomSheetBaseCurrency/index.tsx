import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { FlatList, Platform } from 'react-native';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { SettingsModalItem } from '@screens/Settings/screens/AppPreferences/components/SettingsModalItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { Currency } from '@appTypes';
import { styles } from '../style';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleCurrencySave: (value: Currency) => void;
  selectedCurrency: Currency;
};

type CurrencyData = {
  currency: Currency;
};

const mockedCurrencyList: CurrencyData[] = [
  // {
  //   currency: 'Australian Dollar (AUD)'
  // },
  // {
  //   currency: 'Bitcoin (BTC)'
  // },
  // {
  //   currency: 'British Pound Sterling (GBP)'
  // },
  // {
  //   currency: 'Canadian Dollar (CAD)'
  // },
  // {
  //   currency: 'Chinese Yuan CNY)'
  // },
  // {
  //   currency: 'Ethereum (ETH)'
  // },
  // {
  //   currency: 'Euro (EUR)'
  // },
  // {
  //   currency: 'Japanese Yen (JPY)'
  // },
  {
    currency: 'US Dollars (USD)'
  }
  // {
  //   currency: 'Satoshi (SATS)'
  // }
];
export const BottomSheetSelectBaseCurrency = forwardRef<BottomSheetRef, Props>(
  ({ selectedCurrency, handleCurrencySave }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [modalActiveCurrency, setModalActiveCurrency] = useState<Currency>(
      selectedCurrency || ''
    );
    const { top: topInset } = useSafeAreaInsets();
    const { t } = useTranslation();

    const onCurrencyPress = (value: Currency) => {
      setModalActiveCurrency(value);
      handleCurrencySave(value);
    };

    return (
      <BottomSheet
        height={'100%'}
        ref={localRef}
        containerStyle={styles.bottomSheet}
      >
        {Platform.OS === 'ios' && <Spacer value={topInset} />}
        <Header
          bottomBorder
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={scale(16)}
              color={COLORS.neutral900}
            >
              {t('settings.preferences.select.base.currency')}
            </Text>
          }
          titlePosition={Platform.select({ ios: 'left', default: 'center' })}
          style={styles.header}
          backIconVisible={true}
          onBackPress={() => localRef.current?.dismiss()}
        />
        <Spacer value={19} />
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150
          }}
          data={mockedCurrencyList}
          renderItem={({ item, index }) => {
            return (
              <SettingsModalItem
                modalActiveItem={modalActiveCurrency}
                handleItemPress={onCurrencyPress}
                item={item.currency}
                key={index}
              />
            );
          }}
        />
      </BottomSheet>
    );
  }
);
