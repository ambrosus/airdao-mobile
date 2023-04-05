import React, { forwardRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, CheckBox, Header } from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet/BottomSheet.types';
import { Button, Row, Spacer, Text } from '@components/base';
import { ExplorerSort } from '../Explore.types';
import { CloseIcon } from '@components/svg/icons';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

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
  { title: 'Transaction Count', value: ExplorerSort['Transaction Count'] }
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
            fillColor="#2f2b4399"
          />
        </Row>
      </Button>
    );
  };

  return (
    <BottomSheet ref={localRef} {...bottomSheetProps}>
      <View>
        <Header
          style={styles.header}
          backIconVisible={false}
          contentLeft={
            <Button onPress={localRef.current?.dismiss}>
              <CloseIcon />
            </Button>
          }
          contentRight={
            <Button onPress={onSubmit}>
              <Text
                title
                fontFamily="Inter_600SemiBold"
                color={COLORS.darkGrey}
                opacity={0.5}
              >
                Done
              </Text>
            </Button>
          }
          title="Sort By"
        />
        <Spacer value={verticalScale(32)} />
        <View style={styles.container}>{SORT_ROWS.map(renderRow)}</View>
      </View>
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
  item: {
    marginBottom: verticalScale(41.5)
  }
});
