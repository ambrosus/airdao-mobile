import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useState
} from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { FiltersState, Statuses } from '@features/kosmos/types';
import { FiltersSections } from '@features/kosmos/components/composite';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useForwardedRef } from '@hooks';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { INITIAL_FILTERS } from '@features/kosmos/utils';

interface BottomSheetFiltersProps {
  updateFilters: Dispatch<SetStateAction<FiltersState>>;
}

export const BottomSheetFilters = forwardRef<
  BottomSheetRef,
  BottomSheetFiltersProps
>(({ updateFilters }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);
  const [uiFilters, setUiFilters] = useState<FiltersState>(INITIAL_FILTERS);

  const onResetFilters = useCallback(() => {
    updateFilters(INITIAL_FILTERS);
    setUiFilters(INITIAL_FILTERS);
  }, [updateFilters]);

  const onApplyFilters = useCallback(() => {
    updateFilters(uiFilters);
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef, uiFilters, updateFilters]);

  return (
    <BottomSheet ref={bottomSheetRef} swiperIconVisible>
      <Spacer value={verticalScale(16)} />
      <Text
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral800}
        style={styles.heading}
      >
        Filter by
      </Text>

      <View style={styles.container}>
        <View style={styles.filters}>
          <FiltersSections
            stateKey="status"
            label="Status"
            filters={uiFilters}
            updateFilters={setUiFilters}
            values={[Statuses.ALL, Statuses.ACTIVE, Statuses.CLOSED]}
          />

          <FiltersSections
            stateKey="payment"
            label="Payment token"
            filters={uiFilters}
            updateFilters={setUiFilters}
            values={['BOND', 'USDC', 'AMB']}
          />
        </View>

        <Row alignItems="center" justifyContent="space-between">
          <SecondaryButton style={styles.button} onPress={onResetFilters}>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
            >
              Reset
            </Text>
          </SecondaryButton>

          <PrimaryButton style={styles.button} onPress={onApplyFilters}>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
            >
              Apply
            </Text>
          </PrimaryButton>
        </Row>
      </View>
      <Spacer value={verticalScale(44)} />
    </BottomSheet>
  );
});
