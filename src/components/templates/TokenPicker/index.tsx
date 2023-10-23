import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { SingleAsset, TokenLogo } from '@components/modular';
import { ChevronDownIcon } from '@components/svg/icons';
import { Token } from '@models';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

interface TokenPickerProps {
  tokens: Token[];
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
}

export const TokenPicker = (props: TokenPickerProps) => {
  const { tokens, selectedToken, onSelectToken } = props;
  const pickerModal = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const showModal = () => {
    pickerModal.current?.show();
  };

  const hideModal = () => {
    pickerModal.current?.dismiss();
  };

  const renderToken = (item: Token) => {
    const onPress = () => {
      onSelectToken(item);
      hideModal();
    };
    return (
      <Button onPress={onPress} key={item.name}>
        <SingleAsset token={item} />
      </Button>
    );
  };

  return (
    <>
      <Button
        onPress={showModal}
        style={{
          paddingVertical: verticalScale(6),
          paddingHorizontal: scale(12),
          borderRadius: 1000,
          backgroundColor: COLORS.brand600
        }}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center">
            <TokenLogo
              overrideIconVariants={{
                amb: 'white'
              }}
              token={selectedToken.name}
              style={{ width: moderateScale(32), height: moderateScale(32) }}
            />
            <Spacer value={scale(4)} horizontal />
            <Text color={COLORS.neutral0}>{selectedToken.symbol}</Text>
            <Spacer value={scale(4)} horizontal />
          </Row>
          <ChevronDownIcon />
        </Row>
      </Button>
      <BottomSheet
        swiperIconVisible={true}
        ref={pickerModal}
        containerStyle={{ minHeight: verticalScale(260), maxHeight: '75%' }}
      >
        <Spacer value={verticalScale(16)} />
        <Text
          align="center"
          fontSize={20}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('token.picker.select')}
        </Text>
        <Spacer value={verticalScale(16)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: verticalScale(24) }}
        >
          {tokens.map(renderToken)}
        </ScrollView>
      </BottomSheet>
    </>
  );
};
