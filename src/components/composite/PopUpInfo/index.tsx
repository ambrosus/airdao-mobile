import { View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';
import { PopUpInfoProps } from './PopUpInfo.types';
import { styles } from './styles';

export const PopUpInfo = (props: PopUpInfoProps): JSX.Element => {
  const {
    onInfoPress,
    body,
    title,
    placement,
    testID,
    isVisible,
    onBackdropPress
  } = props;

  return (
    <Popover
      isVisible={isVisible}
      placement={(placement || 'auto') as PopoverPlacement}
      popoverStyle={styles.popoverStyle}
      onRequestClose={onBackdropPress}
      from={() => (
        <View collapsable={false}>
          <Button
            testID={testID}
            onPress={onInfoPress}
            style={styles.container}
          >
            <Text
              style={styles.infoIcon}
              color={COLORS.neutral0}
              fontSize={scale(10)}
            >
              i
            </Text>
          </Button>
        </View>
      )}
    >
      <Text
        fontSize={12}
        fontWeight="700"
        fontFamily="Inter_700Bold"
        color={COLORS.gray800}
      >
        {title}
      </Text>
      <Spacer value={verticalScale(4)} />
      <Text fontSize={12} color={COLORS.gray500}>
        {body}
      </Text>
    </Popover>
  );
};
