import React from 'react';
import { Animated, Pressable } from 'react-native';
import { styles } from '@components/templates/AddressList/styles';
import { Button } from '@components/base';
import { EditIcon, TrashIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

interface Props {
  dragX: Animated.AnimatedInterpolation<number>;
  onPress?: () => void;
  handleConfirmRemove: () => void;
  showEdit: () => void;
}
export const SwipeAction: React.FC<Props> = ({
  dragX,
  onPress,
  handleConfirmRemove,
  showEdit
}) => {
  const trans = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, 20],
    extrapolate: 'clamp'
  });

  return (
    <Pressable style={styles.rightActions} onPress={onPress}>
      <Animated.View
        style={[
          styles.rightActions,
          { backgroundColor: 'transparent' },
          { transform: [{ translateX: trans }] }
        ]}
      >
        <Button onPress={showEdit} style={styles.rightActionsButton}>
          <EditIcon scale={1.5} color={COLORS.brand500} />
        </Button>
        <Button onPress={handleConfirmRemove} style={styles.rightActionsButton}>
          <TrashIcon color={COLORS.error400} />
        </Button>
      </Animated.View>
    </Pressable>
  );
};
