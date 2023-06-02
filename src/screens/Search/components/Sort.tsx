import React, { forwardRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { BottomSheet, CheckBox, Header } from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet/BottomSheet.types';
import { Button, Row, Spacer, Text } from '@components/base';
import { ExplorerSort } from '../Search.types';
import { CloseIcon } from '@components/svg/icons';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { FloatButton } from '@components/base/FloatButton';

interface WalletSortProps extends BottomSheetProps {
  sort: ExplorerSort;
  setSort: React.Dispatch<ExplorerSort>;
}

interface RowItem {
  title: string;
  value: ExplorerSort;
}

const SORT_ROWS: RowItem[] = [
  { title: 'Balance', value: ExplorerSort.Balance },
  { title: 'Transaction Count', value: ExplorerSort['Transaction Count'] },
  { title: 'Address', value: ExplorerSort.Address }
];

export const BottomSheetWalletSort = forwardRef<
  BottomSheetRef,
  WalletSortProps
>((props, ref) => {
  const localRef = useForwardedRef(ref);
  const { sort, setSort, ...bottomSheetProps } = props;

  const [localSort, setLocalSort] = useState<ExplorerSort>(sort);

  const onSubmit = () => {
    setSort(localSort);
    localRef.current?.dismiss();
  };

  const renderRow = (item: RowItem) => {
    return (
      <Button
        key={item.title}
        style={styles.item}
        onPress={() => setLocalSort(item.value)}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Text title fontFamily="Inter_600SemiBold">
            {item.title}
          </Text>
          <CheckBox
            value={localSort === item.value}
            type="circular"
            fillColor={COLORS.sapphireBlue}
          />
        </Row>
      </Button>
    );
  };

  return (
    <BottomSheet
      ref={localRef}
      {...bottomSheetProps}
      height={Platform.OS === 'ios' ? 852 : Dimensions.get('screen').height}
    >
      {Platform.OS === 'android' && <Spacer value={scale(57)} />}
      <View testID="filter-bottom-sheet">
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button onPress={localRef.current?.dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={
            Platform.OS === 'ios' && (
              <Button onPress={onSubmit}>
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
          title="Sort By"
          titleStyle={styles.headerTitle}
        />
        <Spacer value={verticalScale(32)} />
        <View style={styles.container}>{SORT_ROWS.map(renderRow)}</View>
      </View>
      {Platform.OS === 'android' && (
        <FloatButton
          title="Apply Filter"
          onPress={onSubmit}
          bottomPadding={17}
        />
      )}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: verticalScale(54),
    paddingLeft: scale(18),
    paddingRight: scale(32)
  },
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10)
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: COLORS.smokyBlack
  },
  item: {
    marginBottom: verticalScale(41.5)
  }
});
