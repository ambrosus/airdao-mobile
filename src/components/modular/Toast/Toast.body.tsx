import React from 'react';
import { View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { CloseIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { ToastAction, ToastOptions } from './Toast.types';
import { COLORS } from '@constants/colors';
import { ToastBg, ToastBorderColor, ToastStatusIcon } from './Toast.constants';
import { styles } from './Toast.styles';

export const AlertBanner = (
  props: Pick<ToastOptions, 'text' | 'subtext' | 'actions' | 'type'> & {
    hideVisible?: boolean;
    onHide?: () => unknown;
  }
) => {
  const { text, subtext, type, actions, hideVisible, onHide } = props;

  const renderAction = (action: ToastAction) => {
    return (
      <Button onPress={action.onPress} style={styles.actionBtn}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          fontWeight="500"
          color={COLORS.neutral900}
        >
          {action.label}
        </Text>
      </Button>
    );
  };
  return (
    <View
      style={[
        styles.containerStyle,
        {
          backgroundColor: ToastBg[type],
          borderColor: ToastBorderColor[type]
        }
      ]}
    >
      <Row alignItems="center" justifyContent="space-between">
        <View style={styles.statusIcon}>{ToastStatusIcon[type]}</View>
        <View style={{ flex: 1 }}>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral700}
          >
            {text}
          </Text>
          {Boolean(subtext) && (
            <>
              <Spacer value={verticalScale(8)} />
              <Text
                fontSize={14}
                fontWeight="400"
                fontFamily="Inter_400Regular"
                color={COLORS.neutral700}
                style={{ flexDirection: 'row', alignItems: 'baseline' }}
              >
                {subtext}
              </Text>
            </>
          )}
        </View>
        {hideVisible && (
          <Button onPress={onHide} style={styles.closeBtn}>
            <CloseIcon color={COLORS.neutral700} />
          </Button>
        )}
      </Row>
      {actions && actions?.length > 0 && (
        <View style={styles.actions}>{actions?.map(renderAction)}</View>
      )}
    </View>
  );
};
