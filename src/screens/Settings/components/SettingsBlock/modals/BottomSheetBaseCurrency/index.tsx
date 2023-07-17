import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { Dimensions, FlatList, Platform } from 'react-native';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleCurrencySave: (value: Currency) => void;
  selectedCurrency: Currency;
};

export type Currency =
  | 'Australian Dollar (AUD)'
  | 'Bitcoin (BTC)'
  | 'British Pound Sterling (GBP)'
  | 'Canadian Dollar (CAD)'
  | 'Chinese Yuan CNY)'
  | 'Ethereum (ETH)'
  | 'Euro (EUR)'
  | 'Japanese Yen (JPY)'
  | 'US Dollars (USD)'
  | 'Satoshi (SATS)';

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
  {
    currency: 'Ethereum (ETH)'
  },
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

    const onCurrencyPress = (value: Currency) => {
      setModalActiveCurrency(value);
      handleCurrencySave(value);
    };

    return (
      <BottomSheet
        height={Dimensions.get('window').height}
        ref={localRef}
        containerStyle={styles.bottomSheet}
      >
        {Platform.OS === 'ios' && <Spacer value={topInset} />}
        <Header
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={scale(16)}
              color={COLORS.smokyBlack}
            >
              Select base currency
            </Text>
          }
          titlePosition="left"
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
