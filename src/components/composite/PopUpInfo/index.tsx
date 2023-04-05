import React from 'react';
import { View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Button, Spacer, Text } from '@components/base';
import { PopUpInfoProps } from './PopUpInfo.types';
import { styles } from './styles';
import { verticalScale } from '@utils/scaling';

export const PopUpInfo = (props: PopUpInfoProps): JSX.Element => {
  const { body, title, placement } = props;
  return (
    <Popover
      placement={(placement || 'auto') as PopoverPlacement}
      popoverStyle={styles.popoverStyle}
      from={(sourceRef, showPopover) => (
        <View>
          <Button onPress={showPopover} style={styles.container}>
            <Text color="#FFFFFF" fontSize={10}>
              i
            </Text>
          </Button>
        </View>
      )}
    >
      <Text title>{title}</Text>
      <Spacer value={verticalScale(4)} />
      <Text color="#646464">{body}</Text>
    </Popover>
  );
};
