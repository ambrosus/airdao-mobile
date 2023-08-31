import React from 'react';
import { View } from 'react-native';
import { QRCode, QRCodeProps } from '@components/base';
import { LogoBigSVG } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

export const QRCodeWithLogo = (props: QRCodeProps) => {
  return (
    <View style={styles.container}>
      <QRCode {...props} />
      <View style={styles.logo}>
        <View style={styles.logoInner}>
          <LogoBigSVG color={COLORS.white} scale={0.75} />
        </View>
      </View>
    </View>
  );
};
