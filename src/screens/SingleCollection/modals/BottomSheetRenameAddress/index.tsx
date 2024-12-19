import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Input, Text } from '@components/base';
import { Spacer } from '@components/base/Spacer';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { BottomSheetFloat, PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from '@screens/SingleCollection/modals/BottomSheetRenameAddress/styles';
import { scale, verticalScale } from '@utils';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRename: (newName: string | false) => void;
  address?: string;
  groupId?: string;
};
export const BottomSheetRenameAddress = forwardRef<BottomSheetRef, Props>(
  ({ address, handleOnRename }, ref) => {
    const [localAddressName, setLocalAddressName] = useState<string>(
      address || ''
    );
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { t } = useTranslation();

    return (
      <BottomSheetFloat
        ref={localRef}
        containerStyle={{ paddingBottom: verticalScale(24) }}
        swiperIconVisible
      >
        <Spacer value={24} />
        <View style={styles.bottomSheetSubtitle}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {t('address.rename')}
          </Text>
        </View>
        <Input
          value={localAddressName}
          onChangeValue={(value) => setLocalAddressName(value)}
          type="text"
          placeholder={t('address.edit.name')}
          placeholderTextColor={COLORS.neutral900Alpha[60]}
          style={[styles.bottomSheetInput]}
        />
        <Spacer value={24} />
        <View style={{ paddingHorizontal: scale(24) }}>
          <PrimaryButton
            onPress={() => {
              handleOnRename(localAddressName !== address && localAddressName);
            }}
          >
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral0}
            >
              {t('button.save')}
            </Text>
          </PrimaryButton>
          <Spacer value={24} />
          <Button
            type="base"
            style={styles.cancelButton}
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
  }
);
