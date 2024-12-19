import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { ReceiveQRCodeIcon } from '@components/svg/icons';
import { ReceiveFunds } from '@components/templates/ReceiveFunds';
import Config from '@constants/config';
import { scale, verticalScale } from '@utils';
import { AccountActionButton } from './ActionButton';

interface ReceiveProps {
  address: string;
}
export const Receive = (props: ReceiveProps) => {
  const { address } = props;
  const { t } = useTranslation();
  const receiveFundsModal = useRef<BottomSheetRef>(null);

  const showReceiveFunds = () => {
    receiveFundsModal.current?.show();
  };

  return (
    <>
      <AccountActionButton
        Icon={ReceiveQRCodeIcon}
        text={t('account.actions.receive')}
        isActive={Config.walletActions.receive}
        onPress={showReceiveFunds}
      />
      <BottomSheet ref={receiveFundsModal} swiperIconVisible={true}>
        <View style={styles.receiveFunds}>
          <ReceiveFunds address={address} />
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  receiveFunds: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(56),
    paddingHorizontal: scale(24)
  }
});
