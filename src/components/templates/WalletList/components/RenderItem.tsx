import React, { useCallback, useRef } from 'react';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { EditIcon } from '@components/svg/icons';
import { RemoveIcon } from '@components/svg/icons/Remove';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { WalletItem } from '@components/templates/WalletItem';
import { ExplorerAccount } from '@models';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { styles } from '@components/templates/WalletList/styles';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';

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
        borderBottomWidth: 1,
        borderTopWidth: idx === 0 ? 1 : 0
      }
    : {};

  const editModalRef = useRef<BottomSheetRef>(null);
  const swipeable = useRef<Swipeable>(null);

  const showEdit = () => {
    editModalRef.current?.show();
    swipeable.current?.close();
  };

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
          <Button onPress={showEdit}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Spacer horizontal value={scale(52)} />
          <Button onPress={handleConfirmRemove}>
            <RemoveIcon />
          </Button>
        </View>
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
        ref={swipeable}
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
            <WalletItem item={item} />
          </Button>
        </View>
        <BottomSheetEditWallet wallet={item} ref={editModalRef} />
      </Swipeable>
    </>
  );
};
