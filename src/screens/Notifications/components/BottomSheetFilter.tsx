import React, { ForwardedRef, forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, Header } from '@components/composite';
import {
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite/BottomSheet';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { verticalScale } from '@utils/scaling';
import { Button } from '@components/base';

export const BottomSheetTrade = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    return (
      <BottomSheet ref={localRef}>
        <View style={styles.container}>
          {/* <Header
            title="Filter By"
            backIconVisible={false}
            contentLeft={<Button>
				<Closei
			</Button>}
          /> */}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: verticalScale(52)
  },
  row: {
    backgroundColor: '#2f2b430d',
    width: '90%',
    marginBottom: verticalScale(48),
    paddingVertical: verticalScale(12)
  }
});
