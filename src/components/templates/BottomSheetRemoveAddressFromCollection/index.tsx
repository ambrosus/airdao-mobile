import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useMemo
} from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useListsSelector } from '@entities/lists';
import { useListActions } from '@features/lists';
import { useForwardedRef } from '@hooks';
import { ExplorerAccount } from '@models';
import { verticalScale } from '@utils';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  wallet: ExplorerAccount;
};

export const BottomSheetRemoveAddressFromCollection = forwardRef<
  BottomSheetRef,
  Props
>(({ wallet }, ref) => {
  const { t } = useTranslation();
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { listsOfAddressGroup } = useListsSelector();
  const { onToggleAddressInList } = useListActions();

  const collection = useMemo(
    () =>
      listsOfAddressGroup.find(
        (list) =>
          list.accounts.findIndex((account) => account._id === wallet._id) > -1
      ),
    [listsOfAddressGroup, wallet._id]
  );

  const onRemoveAddressInCollection = useCallback(() => {
    if (collection) {
      onToggleAddressInList([wallet], collection);
    }
    setTimeout(() => localRef.current?.dismiss(), 500);
  }, [collection, localRef, onToggleAddressInList, wallet]);

  return (
    <BottomSheetFloat
      ref={localRef}
      containerStyle={{ paddingBottom: verticalScale(24) }}
      swiperIconVisible
    >
      <View testID="BottomSheetConfirmRemove_Container">
        <Text
          style={styles.text}
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.neutral900}
          numberOfLines={1}
        >
          {t('address.remove.from.selected.group', {
            selectedGroup: collection?.name
          })}
        </Text>
        <Spacer value={24} />
        <Button
          testID="BottomSheetConfirmRemove_Button"
          onPress={onRemoveAddressInCollection}
          style={styles.removeButton}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.error400}
          >
            {t('button.remove')}
          </Text>
        </Button>
        <Spacer value={24} />
        <Button
          type="base"
          style={styles.bottomSheetCancelButton}
          onPress={localRef.current?.dismiss}
        >
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral900}
            fontSize={16}
          >
            {t('button.cancel')}
          </Text>
        </Button>
      </View>
    </BottomSheetFloat>
  );
});
