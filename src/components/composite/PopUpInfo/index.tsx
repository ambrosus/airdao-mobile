import React from 'react';
import { StatusBar, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Button, Spacer, Text } from '@components/base';
import { PopUpInfoProps } from './PopUpInfo.types';
import { styles } from './styles';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { DeviceUtils } from '@utils/device';

export const PopUpInfo = (props: PopUpInfoProps): JSX.Element => {
  const { body, title, placement, testID, isVisible, onBackdropPress } = props;
  return (
    <Popover
      isVisible={isVisible}
      placement={(placement || 'auto') as PopoverPlacement}
      popoverStyle={styles.popoverStyle}
      onRequestClose={onBackdropPress}
      verticalOffset={
        DeviceUtils.isAndroid ? -(StatusBar.currentHeight || 0) : 0
      }
      from={(sourceRef, showPopover) => (
        <View>
          <Button
            testID={testID}
            onPress={showPopover}
            style={styles.container}
          >
            <Text color="#FFFFFF" fontSize={10}>
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
