import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useState
} from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { FiltersState } from '@features/kosmos/types';
import { FiltersSections } from '@features/kosmos/components/composite';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { useForwardedRef } from '@hooks';
import { SecondaryButton } from '@components/modular';
import { INITIAL_FILTERS } from '@features/kosmos/utils';

interface BottomSheetFiltersProps {
  updateFilters: Dispatch<SetStateAction<FiltersState>>;
}

export const BottomSheetFilters = forwardRef<
  BottomSheetRef,
  BottomSheetFiltersProps
>(({ updateFilters }, ref) => {
  const { t } = useTranslation();
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
        {t('kosmos.filter.by')}
      </Text>

      <View style={styles.container}>
        <View style={styles.filters}>
          <FiltersSections
            stateKey="status"
            label={t('common.status')}
            filters={uiFilters}
            updateFilters={setUiFilters}
            values={[
              t('kosmos.status.all'),
              t('kosmos.status.active'),
              t('kosmos.status.closed')
            ]}
          />

          <FiltersSections
            stateKey="payment"
            label={t('kosmos.filter.payment')}
            filters={uiFilters}
            updateFilters={setUiFilters}
            values={['BOND', 'USDC', 'AMB']}
          />
        </View>

        <Row
          style={styles.buttonContainer}
          alignItems="center"
          justifyContent="space-between"
        >
          <SecondaryButton style={styles.button} onPress={onResetFilters}>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
              style={styles.buttonText}
            >
              {t('kosmos.button.reset')}
            </Text>
          </SecondaryButton>

          <SecondaryButton
            style={{ ...styles.button, backgroundColor: COLORS.brand500 }}
            onPress={onApplyFilters}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
              style={styles.buttonText}
            >
              {t('kosmos.button.apply')}
            </Text>
          </SecondaryButton>
        </Row>
      </View>
      <Spacer value={verticalScale(44)} />
    </BottomSheet>
  );
});
