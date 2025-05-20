import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ShimmerLoader } from '@components/animations';
import { UnknownTokenIcon } from '@components/svg/icons';
import { styles } from './styles';

const headers = {
  'Accept-Ranges': 'bytes',
  'Access-Control-Allow-Headers':
    'Content-Type, Range, User-Agent, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Content-Type': 'image/webp',
  'Accept-Encoding': 'gzip'
};

interface TokenImageWithShimmerProps {
  src: string;
  scale?: number;
  loading?: boolean;
}

const TokenImageIpfsWithShimmerComponent = ({
  src,
  scale = 1,
  loading: propsLoading = false
}: TokenImageWithShimmerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const size = useMemo(() => scale * 32, [scale]);

  const isImageLoading = useMemo(
    () => loading || propsLoading,
    [loading, propsLoading]
  );

  const uri = useMemo(() => `https://ipfs.io/ipfs/${src}`, [src]);

  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoadEnd = useCallback(() => setLoading(false), []);
  const onError = useCallback(() => setError(true), []);

  if (error) {
    return <UnknownTokenIcon scale={scale} />;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.innerRelativeContainer}>
        {isImageLoading && (
          <ShimmerLoader
            width={size}
            height={size}
            borderRadius={Number.MAX_SAFE_INTEGER}
          />
        )}
      </View>
      {src && (
        <FastImage
          style={{
            width: size,
            height: size,
            borderRadius: Number.MAX_SAFE_INTEGER
          }}
          source={{
            uri,
            headers,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable
          }}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onError}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
    </View>
  );
};

export const TokenImageIpfsWithShimmer = memo(
  TokenImageIpfsWithShimmerComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.src === nextProps.src && prevProps.scale === nextProps.scale
    );
  }
);
