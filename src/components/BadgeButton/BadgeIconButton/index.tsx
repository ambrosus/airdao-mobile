import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  icon: JSX.Element;
};
export const BadgeButton: FC<Props> = (props) => {
  const { icon } = props;
  return (
    <View style={styles.buttonBackgroundStyle}>
      <View style={styles.buttonStyle}>{icon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBackgroundStyle: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ' rgba(47, 43, 67, 0.05)'
  },
  buttonStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
