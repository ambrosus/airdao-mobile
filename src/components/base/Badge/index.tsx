import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  icon: JSX.Element;
  color: string;
};
export const Badge: FC<Props> = (props) => {
  const { icon, color } = props;
  return (
    <View style={[styles.buttonBackgroundStyle, { backgroundColor: color }]}>
      <View style={styles.buttonStyle}>{icon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBackgroundStyle: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    padding: 8,
    // width: 40,
    // height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
