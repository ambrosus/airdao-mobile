import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetFloat, PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils';
import { styles } from './styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleCreateCollectionPress: () => void;
  handleOnAddNewAddress: () => void;
};

export const BottomSheetCreateCollectionOrAddAddress = forwardRef<
  BottomSheetRef,
  Props
>(({ handleCreateCollectionPress, handleOnAddNewAddress }, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { t } = useTranslation();

  return (
    <BottomSheetFloat
      ref={localRef}
      swiperIconVisible
      testID="Create_Collection_Or_Add_Address_BottomSheet"
    >
      <View style={styles.main} testID="BottomSheet_Content">
        <Spacer value={scale(24)} />
        <PrimaryButton
          onPress={handleOnAddNewAddress}
          testID="Add_Address_Button"
        >
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            {t('collection.add.address')}
          </Text>
        </PrimaryButton>
        <Spacer value={scale(24)} />
        <Button
          onPress={handleCreateCollectionPress}
          type="circular"
          style={styles.button}
          testID="Create_Collection_Button"
        >
          <Text
            style={styles.btnTitle}
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral900}
          >
            {t('collection.create')}
          </Text>
        </Button>
      </View>
    </BottomSheetFloat>
  );
});
