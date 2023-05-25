import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { Dimensions, FlatList, Platform, View } from 'react-native';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { CloseIcon } from '@components/svg/icons/Close';
import { COLORS } from '@constants/colors';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';
import { BackIcon } from '@components/svg/icons';
import { FloatButton } from '@components/base/FloatButton';
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
  | 'Euro (EUR)'
  | 'Japanese Yen (JPY)'
  | 'US Dollars (USD)'
  | 'Satoshi (SATS)';

type CurrencyData = {
  currency: Currency;
};

const mockedCurrencyList: CurrencyData[] = [
  {
    currency: 'Australian Dollar (AUD)'
  },
  {
    currency: 'Bitcoin (BTC)'
  },
  {
    currency: 'British Pound Sterling (GBP)'
  },
  {
    currency: 'Canadian Dollar (CAD)'
  },
  {
    currency: 'Chinese Yuan CNY)'
  },
  {
    currency: 'Euro (EUR)'
  },
  {
    currency: 'Japanese Yen (JPY)'
  },
  {
    currency: 'US Dollars (USD)'
  },
  {
    currency: 'Satoshi (SATS)'
  }
];
export const BottomSheetSelectBaseCurrency = forwardRef<BottomSheetRef, Props>(
  ({ selectedCurrency, handleCurrencySave }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [modalActiveCurrency, setModalActiveCurrency] = useState<Currency>(
      selectedCurrency || ''
    );

    const onCurrencyPress = (value: Currency) => {
      setModalActiveCurrency(value);
    };
    return (
      <BottomSheet
        height={Platform.OS === 'ios' ? 852 : Dimensions.get('screen').height}
        ref={localRef}
      >
        {Platform.OS === 'android' && <Spacer value={scale(57)} />}
        <Header
          titleStyle={styles.headerTitle}
          title="Select base currency"
          titlePosition="center"
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button
              type="base"
              onPress={() => {
                localRef.current?.dismiss();
              }}
            >
              {Platform.OS === 'ios' ? <CloseIcon /> : <BackIcon />}
            </Button>
          }
          contentRight={
            <>
              {Platform.OS === 'ios' && (
                <Button
                  type="base"
                  onPress={() => {
                    localRef.current?.dismiss();
                    handleCurrencySave(modalActiveCurrency);
                  }}
                >
                  <Text
                    fontFamily="Inter_600SemiBold"
                    color={COLORS.jungleGreen}
                    fontSize={16}
                  >
                    Save
                  </Text>
                </Button>
              )}
            </>
          }
        />
        {Platform.OS === 'android' && <Spacer value={19} />}
        <View>
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
        </View>
        {Platform.OS === 'android' && (
          <FloatButton
            title="Save"
            onPress={() => {
              localRef.current?.dismiss();
              handleCurrencySave(modalActiveCurrency);
            }}
            bottomPadding={17}
          />
        )}
      </BottomSheet>
    );
  }
);
