import React, { useCallback, useRef, useState } from 'react';
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
import { BottomSheetRemoveAddressFromCollection } from '@components/templates/BottomSheetRemoveAddressFromCollection';

export type SwipeableWalletItemProps = {
  item: ExplorerAccount;
  idx: number;
  isPortfolioFlow?: boolean;
  removeType?: 'watchlist' | 'collection';
};
export const SwipeableWalletItem = ({
  item,
  idx,
  isPortfolioFlow = false,
  removeType = 'watchlist'
}: SwipeableWalletItemProps) => {
  const confirmRemoveRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<WalletsNavigationProp>();
  const [disabled, setDisabled] = useState<boolean>(false);

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
        <View style={styles.rightActions}>
          <Button onPress={showEdit}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Spacer horizontal value={scale(52)} />
          <Button onPress={handleConfirmRemove}>
            <RemoveIcon />
          </Button>
        </View>
        {removeType === 'watchlist' && (
          <BottomSheetRemoveAddressFromWatchlists
            item={item}
            ref={confirmRemoveRef}
          />
        )}
        {removeType === 'collection' && (
          <BottomSheetRemoveAddressFromCollection
            wallet={item}
            ref={confirmRemoveRef}
          />
        )}
      </>
    );
  };

  return (
    <Swipeable
      ref={swipeable}
      enabled={isPortfolioFlow}
      renderRightActions={renderRightActions}
      onBegan={() => {
        setTimeout(() => {
          setDisabled(true);
        }, 80);
      }}
      onEnded={() => {
        setDisabled(false);
      }}
    >
      <View
        style={{
          backgroundColor: 'white'
        }}
      >
        <Button
          key={idx}
          style={[{ ...styles.item }, stylesForPortfolio]}
          onPress={() => {
            if (!disabled) {
              navigateToAddressDetails();
            }
          }}
          testID={`WalletItem_${idx}`}
        >
          <WalletItem item={item} />
        </Button>
      </View>
      <BottomSheetEditWallet wallet={item} ref={editModalRef} />
    </Swipeable>
  );
};
