import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils';

interface HistoryIconModel extends IconProps {
  notification: boolean;
}

export const HistoryIcon = ({
  scale = 1,
  color = COLORS.black,
  notification
}: HistoryIconModel) => {
  const sizeValue = scaleFunc(20);
  const width = sizeValue * scale;
  const height = sizeValue * scale;
  const Notification = () => {
    const notificationSizeValue = sizeValue / 1.45;
    const borderWidth = notificationSizeValue * 0.2 || 0;

    return (
      <View
        style={{
          ...styles.notificationPoint,
          width: notificationSizeValue,
          height: notificationSizeValue,
          borderWidth
        }}
      />
    );
  };
  return (
    <View>
      {notification && <Notification />}

      <Svg
        width={width}
        height={height}
        fill="none"
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          fill={color}
          d="M17 20.5H1a1 1 0 0 1-1-1v-18a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Zm-1-2v-16H2v16h14ZM5 5.5h8v2H5v-2Zm0 4h8v2H5v-2Zm0 4h5v2H5v-2Z"
        />
      </Svg>
    </View>
  );
};

export const styles = StyleSheet.create({
  notificationPoint: {
    position: 'absolute',
    zIndex: 10,
    top: scaleFunc(-3),
    right: scaleFunc(-3),
    borderRadius: 10,
    borderColor: COLORS.neutral0,
    backgroundColor: COLORS.warning600
  }
});
