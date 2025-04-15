import { memo, useCallback, useMemo, useState } from 'react';
import { View, Image } from 'react-native';
import { ShimmerLoader } from '@components/animations';
import { styles } from './styles';

interface TokenImageWithShimmerProps {
  src: string;
  scale?: number;
}

const TokenImageIpfsWithShimmerMemo = ({
  src,
  scale = 1
}: TokenImageWithShimmerProps) => {
  const [loading, setLoading] = useState(false);

  const size = useMemo(() => scale * 32, [scale]);

  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoadEnd = useCallback(() => setLoading(false), []);

  const imageSource = useMemo(
    () => ({
      uri: `https://ipfs.io/ipfs/${src}`
    }),
    [src]
  );

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.innerRelativeContainer}>
        {loading && (
          <ShimmerLoader
            width={size}
            height={size}
            borderRadius={Number.MAX_SAFE_INTEGER}
          />
        )}
      </View>
      <Image
        resizeMode="cover"
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        source={imageSource}
        style={{
          width: size,
          height: size,
          borderRadius: Number.MAX_SAFE_INTEGER
        }}
      />
    </View>
  );
};

export const TokenImageIpfsWithShimmer = memo(TokenImageIpfsWithShimmerMemo);
