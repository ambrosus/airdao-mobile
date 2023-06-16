import React from 'react';
import { Animated, Pressable } from 'react-native';
import { styles } from '@components/templates/WalletList/styles';
import { Button } from '@components/base';
import { EditIcon, TrashIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { BottomSheetRemoveAddressFromWatchlists } from '@components/templates/BottomSheetConfirmRemove/BottomSheetRemoveAddressFromWatchlists';
import { ExplorerAccount } from '@models';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetRemoveAddressFromCollection } from '@components/templates';
import { SwipeableWalletItemProps } from '@components/templates/WalletList/components/RenderItem';

interface Props {
  item: ExplorerAccount;
}

interface SwipeActionsProps
  extends Props,
    Pick<SwipeableWalletItemProps, 'removeType'> {
  dragX: Animated.AnimatedInterpolation<number>;
  onPress?: () => void;
  handleConfirmRemove: () => void;
  confirmRemoveRef: React.RefObject<BottomSheetRef>;
  showEdit: () => void;
  removeType?: 'watchlist' | 'collection';
}

export const SwipeAction: React.FC<SwipeActionsProps> = ({
  dragX,
  onPress,
  item,
  handleConfirmRemove,
  confirmRemoveRef,
  showEdit,
  removeType = 'watchlist'
}) => {
  const trans = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, 20],
    extrapolate: 'clamp'
  });

  return (
    <>
      <Pressable style={styles.rightActions} onPress={onPress}>
        <Animated.View
          style={[
            styles.rightActions,
            { backgroundColor: 'transparent' },
            { transform: [{ translateX: trans }] }
          ]}
        >
          <Button onPress={showEdit} style={styles.rightActionsButton}>
            <EditIcon scale={1.5} color={COLORS.electricBlue} />
          </Button>
          <Button
            onPress={handleConfirmRemove}
            style={styles.rightActionsButton}
          >
            <TrashIcon color={COLORS.crimsonRed} />
          </Button>
        </Animated.View>
      </Pressable>
      {removeType === 'watchlist' && (
        <BottomSheetRemoveAddressFromWatchlists
          key={item.address}
          item={item}
          ref={confirmRemoveRef}
        />
      )}
      {removeType === 'collection' && (
        <BottomSheetRemoveAddressFromCollection
          key={item.address}
          wallet={item}
          ref={confirmRemoveRef}
        />
      )}
    </>
  );
};
