import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { StyleSheet, View } from 'react-native';
import { scale } from '@utils/scaling';

interface CloseIconModel extends IconProps {
  border?: boolean;
}

export function CloseIcon(props: CloseIconModel) {
  const { color = COLORS.neutral900, scale = 1, border } = props;
  const width = 24;
  const height = 24;

  return (
    <View style={border ? styles.closeButtonContainer : {}}>
      <Svg
        width={width * scale}
        height={height * scale}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        <Path
          d="M4.21 4.387l.083-.094a1 1 0 011.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 111.414 1.414L13.415 12l6.292 6.293a1 1 0 01.083 1.32l-.083.094a1 1 0 01-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 01-1.414-1.414L10.585 12 4.293 5.707a1 1 0 01-.083-1.32l.083-.094-.083.094z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButtonContainer: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(3)
  }
});
