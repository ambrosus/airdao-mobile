import React, { useCallback, useRef } from 'react';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { EditIcon } from '@components/svg/icons';
import { RemoveIcon } from '@components/svg/icons/Remove';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { WalletItem } from '@components/templates';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { useAllAddressesReducer } from '@contexts';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { BottomSheetRenameAddress } from '@screens/SingleCollection/modals/BottomSheetRenameAddress';

type Props = {
  item: ExplorerAccount;
  idx: number;
  isPortfolioFlow?: boolean;
};
export const RenderItem = ({ item, idx, isPortfolioFlow = false }: Props) => {
  const confirmRemoveRef = useRef<BottomSheetRef>(null);

  const navigation = useNavigation<WalletsNavigationProp>();

  const handleConfirmRemove = useCallback(() => {
    confirmRemoveRef.current?.show();
  }, []);
  const navigateToAddressDetails = () => {
    navigation.navigate('Address', { address: item.address });
  };
  const stylesForPortfolio = isPortfolioFlow
    ? {
        paddingVertical: 18,
        borderColor: COLORS.charcoal,
        borderBottomWidth: idx !== 0 ? 1 : 0,
        borderTopWidth: idx === 0 ? 1 : 0,
        marginTop: idx === 0 ? verticalScale(20) : 0
      }
    : {};

  const renameAddressRef = useRef<BottomSheetRef>(null);
  const handleOnOpenRenameAddress = () => renameAddressRef.current?.show();

  const allAddressesReducer = useAllAddressesReducer();

  const handleOnRenameAddress = useCallback(
    (newName: string | false) => {
      if (!newName) return;
      const saveAddress = async () => {
        const newWallet: ExplorerAccount = Object.assign({}, item);
        newWallet.name = newName;
        newWallet.isPersonal = false;
        allAddressesReducer({ type: 'update', payload: newWallet });
        renameAddressRef.current?.dismiss();
      };
      saveAddress();
    },
    [allAddressesReducer, item, renameAddressRef]
  );

  const renderRightActions = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: COLORS.charcoal,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: scale(130)
          }}
        >
          <Button onPress={handleOnOpenRenameAddress}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Spacer horizontal value={scale(52)} />
          <Button onPress={handleConfirmRemove}>
            <RemoveIcon />
          </Button>
        </View>
        <BottomSheetRenameAddress
          handleOnRename={handleOnRenameAddress}
          ref={renameAddressRef}
          address={item.address}
        />
        <BottomSheetRemoveAddressFromWatchlists
          item={item}
          ref={confirmRemoveRef}
        />
      </>
    );
  };

  return (
    <>
      <Swipeable
        enabled={isPortfolioFlow}
        renderRightActions={() => renderRightActions()}
      >
        <View
          style={{
            backgroundColor: 'white'
          }}
        >
          <Button
            key={idx}
            style={[{ ...styles.item }, stylesForPortfolio]}
            onPress={navigateToAddressDetails}
            testID={`WalletItem_${idx}`}
          >
            <WalletItem item={item} isPortfolioFlow={isPortfolioFlow} />
          </Button>
        </View>
      </Swipeable>
    </>
  );
};
