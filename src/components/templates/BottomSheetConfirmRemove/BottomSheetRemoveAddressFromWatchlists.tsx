import React, { ForwardedRef, forwardRef, RefObject, useCallback } from 'react';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef, useWatchlist } from '@hooks';
import { styles } from '@components/templates/BottomSheetConfirmRemove/styles';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models';
import { BottomSheetFloat } from '@components/modular';
import { verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';

type Props = {
  ref: RefObject<BottomSheetRef>;
  item: ExplorerAccount;
};

export const BottomSheetRemoveAddressFromWatchlists = forwardRef<
  BottomSheetRef,
  Props
>(({ item }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { removeFromWatchlist } = useWatchlist();
  const { t } = useTranslation();

  const handleRemoveAddressFromWatchlist = useCallback(() => {
    removeFromWatchlist(item);
    setTimeout(() => {
      localRef.current?.dismiss();
    }, 400);
  }, [item, localRef, removeFromWatchlist]);

  return (
    <BottomSheetFloat
      ref={localRef}
      containerStyle={{ paddingBottom: verticalScale(24) }}
      swiperIconVisible
      testID="BottomSheet_Remove_Address_From_Watchlists"
    >
      <View testID="BottomSheet_Content">
        <Text
          style={styles.text}
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.smokyBlack}
        >
          {t('confirm.remove.address.from.watchlist')}
        </Text>
        <Spacer value={24} />
        <Button
          testID="BottomSheetConfirmRemove_Button"
          onPress={handleRemoveAddressFromWatchlist}
          style={styles.removeButton}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.crimsonRed}
          >
            {t('remove.btn')}
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetCancelButton}
          onPress={() => localRef.current?.dismiss()}
          testID="Cancel_Button"
        >
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.smokyBlack}
            fontSize={16}
          >
            {t('cancel.btn')}
          </Text>
        </Button>
      </View>
    </BottomSheetFloat>
  );
});
