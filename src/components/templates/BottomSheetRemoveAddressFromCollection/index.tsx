import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { ExplorerAccount } from '@models';
import { BottomSheetFloat } from '@components/modular';
import { verticalScale } from '@utils/scaling';
import { useLists } from '@contexts';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  wallet: ExplorerAccount;
};

export const BottomSheetRemoveAddressFromCollection = forwardRef<
  BottomSheetRef,
  Props
>(({ wallet }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { toggleAddressesInList, listsOfAddressGroup } = useLists((v) => v);
  const { t } = useTranslation();
  const collection = listsOfAddressGroup.find(
    (list) =>
      list.accounts.findIndex((account) => account._id === wallet._id) > -1
  );

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
          onPress={() => {
            if (collection) {
              toggleAddressesInList([wallet], collection);
            }
            localRef.current?.dismiss();
          }}
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
          onPress={() => localRef.current?.dismiss()}
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
