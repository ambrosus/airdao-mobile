import React, { ForwardedRef, forwardRef, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';
import {
  BottomSheet,
  CheckBox,
  Header,
  DatePicker
} from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Row, Spacer, Text } from '@components/base';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { NotificationFilter } from '@appTypes/notification';

interface BottomSheetFilterProps extends BottomSheetProps {
  filter: NotificationFilter;
  onSubmit: (newFilter: NotificationFilter) => unknown;
}

export const BottomSheetFilter = forwardRef<
  BottomSheetRef,
  BottomSheetFilterProps
>((props, ref) => {
  const { filter, ...bottomSheetProps } = props;
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const [localFilter, setLocalFilter] = useState(filter);
  const datePickerModal = useRef<BottomSheetRef>(null);

  const onFilterKeyChange = (
    key: keyof NotificationFilter,
    value: boolean | null | Date
  ) => {
    setLocalFilter({ ...localFilter, [key]: value });
  };

  const showDatePicker = () => {
    datePickerModal.current?.show();
  };

  return (
    <BottomSheet
      containerStyle={{
        marginHorizontal: -20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }}
      ref={localRef}
      height={WINDOW_HEIGHT * 0.9}
      borderRadius={scale(10)}
      {...bottomSheetProps}
    >
      <View testID="filter-modal">
        <Header
          title="Filter By"
          titleStyle={styles.headerTitle}
          titlePosition="center"
          backIconVisible={false}
          style={styles.header}
          contentLeft={
            <Button onPress={() => localRef.current?.dismiss()}>
              <CloseIcon />
            </Button>
          }
          contentRight={
            Platform.OS === 'ios' && (
              <Button onPress={() => localRef.current?.dismiss()}>
                <Text
                  title
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.jungleGreen}
                >
                  Done
                </Text>
              </Button>
            )
          }
        />
        <View style={styles.container}>
          <Button onPress={showDatePicker}>
            <Row alignItems="center" justifyContent="space-between">
              <Text title fontFamily="Inter_600SemiBold">
                Select Date
              </Text>
            </Row>
          </Button>
          <Spacer value={verticalScale(30)} />
          <Button
            onPress={() =>
              onFilterKeyChange('priceAlerts', !localFilter.priceAlerts)
            }
          >
            <Row
              alignItems="center"
              justifyContent="space-between"
              style={styles.row}
            >
              <Text title fontFamily="Inter_600SemiBold">
                Price Alerts
              </Text>
              {localFilter.priceAlerts && (
                <CheckBox
                  type="circular"
                  fillColor={COLORS.sapphireBlue}
                  value={localFilter.priceAlerts}
                  onValueChange={(newValue) =>
                    onFilterKeyChange('priceAlerts', newValue)
                  }
                />
              )}
            </Row>
          </Button>
          <Spacer value={verticalScale(30)} />
          <Button
            onPress={() =>
              onFilterKeyChange(
                'transactionAlerts',
                !localFilter.transactionAlerts
              )
            }
          >
            <Row
              style={styles.row}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text title fontFamily="Inter_600SemiBold">
                Transaction Alerts
              </Text>
              {localFilter.transactionAlerts && (
                <CheckBox
                  type="circular"
                  fillColor={COLORS.sapphireBlue}
                  value={localFilter.transactionAlerts}
                  onValueChange={(newValue) =>
                    onFilterKeyChange('transactionAlerts', newValue)
                  }
                />
              )}
            </Row>
          </Button>
          <Spacer value={verticalScale(30)} />
          <Button
            onPress={() =>
              onFilterKeyChange('marketUpdates', !localFilter.marketUpdates)
            }
          >
            <Row
              style={styles.row}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text title fontFamily="Inter_600SemiBold">
                Market updates
              </Text>
              {localFilter.marketUpdates && (
                <CheckBox
                  type="circular"
                  fillColor={COLORS.sapphireBlue}
                  value={localFilter.marketUpdates}
                  onValueChange={(newValue) =>
                    onFilterKeyChange('marketUpdates', newValue)
                  }
                />
              )}
            </Row>
          </Button>
          <Spacer value={verticalScale(30)} />
          <Button
            onPress={() =>
              onFilterKeyChange('walletUpdates', !localFilter.walletUpdates)
            }
          >
            <Row
              style={styles.row}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text title fontFamily="Inter_600SemiBold">
                Portfolio updates
              </Text>
              {localFilter.walletUpdates && (
                <CheckBox
                  type="circular"
                  fillColor={COLORS.sapphireBlue}
                  value={localFilter.walletUpdates}
                  onValueChange={(newValue) =>
                    onFilterKeyChange('walletUpdates', newValue)
                  }
                />
              )}
            </Row>
          </Button>
        </View>
      </View>
      <BottomSheet
        ref={datePickerModal}
        height={WINDOW_HEIGHT * 0.75}
        isNestedSheet
      >
        <View style={styles.datePicker}>
          <DatePicker selectedStartDate={new Date()} />
        </View>
      </BottomSheet>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(52),
    paddingLeft: scale(16),
    paddingRight: scale(24),
    backgroundColor: '#FFFFFF',
    height: '100%'
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  row: {
    height: verticalScale(32)
  },
  datePicker: {
    paddingTop: verticalScale(18),
    height: '100%',
    backgroundColor: '#FFFFFF'
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: COLORS.smokyBlack
  }
});
