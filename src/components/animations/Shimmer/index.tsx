// ShimmerLoader.js
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

interface ShimmerLoaderProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
}

export const ShimmerLoader = ({
  width = '100%',
  height = 150,
  borderRadius = 4
}: Partial<ShimmerLoaderProps>) => {
  const translateX = useSharedValue(-Dimensions.get('window').width);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(Dimensions.get('window').width, { duration: 2250 }),
      -1,
      false
    );
  }, [translateX]);

  return (
    <View style={{ ...styles.container, width, height, borderRadius }}>
      <Reanimated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={['#E0E0E0', '#F0F0F0', '#E0E0E0']}
          start={[0, 0.5]}
          end={[1, 0.5]}
          style={styles.gradient}
        />
      </Reanimated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F2F2F3',
    borderRadius: 4
  },
  shimmer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});
