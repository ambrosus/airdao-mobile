import { forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { styles } from './styles';

export const BottomSheetFloat = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const { testID, ...bottomSheetProps } = props;

    return (
      <BottomSheet
        ref={ref}
        {...bottomSheetProps}
        containerStyle={{
          // eslint-disable-next-line @typescript-eslint/ban-types
          ...(bottomSheetProps.containerStyle || {}),
          ...styles.container
        }}
        testID={testID}
      />
    );
  }
);
