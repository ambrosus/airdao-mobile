import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { WalletAvatarDefault } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { AccountDBModel } from '@database';
import { verticalScale } from '@utils';
import { styles } from './styles';
import { WalletAvatars, avatarScale } from './WalletPicker.constants';
import { WalletPickerItem } from './WalletPicker.item';

interface WalletPickerProps {
  wallets: AccountDBModel[];
  selectedWallet: AccountDBModel | null;
  onSelectWallet: (wallet: AccountDBModel) => void;
}

export const WalletPicker = (props: WalletPickerProps) => {
  const { wallets, selectedWallet, onSelectWallet } = props;
  const pickerModal = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();
  const selectedIndex = wallets.findIndex(
    (w) => w.address === selectedWallet?.address
  );

  const showModal = () => {
    pickerModal.current?.show();
  };

  const hideModal = () => {
    pickerModal.current?.dismiss();
  };

  const renderWallet = (item: AccountDBModel, idx: number) => {
    const onPress = () => {
      onSelectWallet(item);
      hideModal();
    };
    return (
      <View key={item.address}>
        <Button onPress={onPress}>
          <WalletPickerItem
            wallet={item}
            index={idx}
            selected={selectedIndex === idx}
          />
        </Button>
        <Spacer value={verticalScale(24)} />
      </View>
    );
  };

  return (
    <>
      <Button onPress={showModal} style={styles.circularAvatar}>
        {selectedIndex > -1 ? (
          WalletAvatars[selectedIndex]
        ) : (
          <WalletAvatarDefault scale={avatarScale} />
        )}
      </Button>
      <BottomSheet
        swiperIconVisible={true}
        ref={pickerModal}
        containerStyle={styles.wrapper}
      >
        <Spacer value={verticalScale(16)} />
        <Text
          align="center"
          fontSize={20}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('wallet.picker.select')}
        </Text>
        <Spacer value={verticalScale(16)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.container}
        >
          {wallets.map(renderWallet)}
        </ScrollView>
      </BottomSheet>
    </>
  );
};
