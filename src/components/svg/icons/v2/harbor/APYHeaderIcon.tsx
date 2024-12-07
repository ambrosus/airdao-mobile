import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const APYHeaderIcon = ({ scale = 1, color = COLORS.success300 }) => {
  const width = 18 * scale;
  const height = 18 * scale;

  return (
    <View
      style={{
        ...styles.main,
        width: width * scale * 1.5,
        height: height * scale * 1.5,
        backgroundColor: color
      }}
    >
      <Svg width={width} height={height} fill="none">
        <Path
          fill="#fff"
          d="M8.438 13.688H6.75c-.825 0-1.5.675-1.5 1.5v.187H4.5a.567.567 0 0 0-.563.563c0 .307.256.562.563.562h9a.567.567 0 0 0 .563-.563.567.567 0 0 0-.563-.562h-.75v-.188c0-.824-.675-1.5-1.5-1.5H9.562V11.97c-.187.022-.374.03-.562.03-.188 0-.375-.008-.563-.03v1.717Z"
        />
        <Path
          fill="#fff"
          d="M13.86 8.73a3.67 3.67 0 0 0 1.275-.84c.697-.772 1.155-1.695 1.155-2.775 0-1.08-.847-1.928-1.927-1.928h-.42A2.996 2.996 0 0 0 11.25 1.5h-4.5c-1.185 0-2.205.69-2.693 1.688h-.42c-1.08 0-1.927.847-1.927 1.927s.457 2.002 1.155 2.775c.345.345.78.653 1.275.84A5.236 5.236 0 0 0 9 12c2.205 0 4.08-1.35 4.86-3.27Zm-2.73-2.393-.465.57a.563.563 0 0 0-.12.36l.045.735c.03.45-.293.683-.713.518l-.682-.27a.69.69 0 0 0-.39 0l-.683.27c-.42.165-.742-.067-.712-.518l.045-.735a.563.563 0 0 0-.12-.36l-.465-.57c-.293-.345-.165-.727.27-.84l.712-.18a.595.595 0 0 0 .308-.232l.397-.615c.248-.382.638-.382.885 0l.398.615c.06.098.195.202.308.232l.712.18c.435.113.563.495.27.84Z"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  }
});
