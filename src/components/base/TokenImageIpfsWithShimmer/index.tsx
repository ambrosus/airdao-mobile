import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { View, Image, Dimensions } from 'react-native';
import { ShimmerLoader } from '@components/animations';
import { styles } from './styles';

const IN_VIEW_THRESHOLD = 200;

// IPFS Gateways
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

// In-memory cache to track which images have been successfully loaded
const loadedImages = new Set<string>();

// In-memory cache to track which images have failed to load
const failedImages = new Set<string>();

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
  const [loading, setLoading] = useState(!loadedImages.has(src));
  const [error, setError] = useState(failedImages.has(src));
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const viewRef = useRef<View>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const size = useMemo(() => scale * 32, [scale]);

  const onLoadStart = useCallback(() => {
    if (loadedImages.has(src)) return;

    setLoading(true);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      if (loading && !loadedImages.has(src)) {
        if (gatewayIndex < IPFS_GATEWAYS.length - 1) {
          setGatewayIndex((prev) => prev + 1);
        } else {
          setError(true);
          failedImages.add(src);
        }
      }
    }, 10000);
  }, [src, gatewayIndex, loading]);

  const onLoadEnd = useCallback(() => {
    setLoading(false);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    if (!error) {
      loadedImages.add(src);
    }
  }, [src, error]);

  const imageSource = useMemo(() => {
    if (!isInView || !src) return null;

    if (failedImages.has(src)) return null;

    return { uri: `${IPFS_GATEWAYS[gatewayIndex]}${src}` };
  }, [src, isInView, gatewayIndex]);

  const isImageLoading = useMemo(
    () => (loading && !loadedImages.has(src)) || propsLoading || !isInView,
    [loading, propsLoading, isInView, src]
  );

  const onError = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    setLoading(false);

    if (gatewayIndex < IPFS_GATEWAYS.length - 1) {
      setGatewayIndex((prev) => prev + 1);
    } else {
      setError(true);
      failedImages.add(src);
    }
  }, [gatewayIndex, src]);

  const checkIfInView = useCallback(() => {
    if (loadedImages.has(src)) {
      setIsInView(true);
      return;
    }

    if (viewRef.current) {
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        const windowHeight = Dimensions.get('window').height;
        const windowWidth = Dimensions.get('window').width;

        const isVisible =
          pageY + height > -IN_VIEW_THRESHOLD &&
          pageY < windowHeight + IN_VIEW_THRESHOLD &&
          pageX + width > -IN_VIEW_THRESHOLD &&
          pageX < windowWidth + IN_VIEW_THRESHOLD;

        setIsInView(isVisible);
      });
    }
  }, [src]);

  useEffect(() => {
    setLoading(!loadedImages.has(src));
    setError(failedImages.has(src));
    setGatewayIndex(0);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, [src]);

  useEffect(() => {
    checkIfInView();

    if (
      !loadedImages.has(src) &&
      !failedImages.has(src) &&
      !checkIntervalRef.current
    ) {
      checkIntervalRef.current = setInterval(checkIfInView, 1000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [checkIfInView, src]);

  if (failedImages.has(src) && !loadedImages.has(src)) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View
          style={[
            styles.innerRelativeContainer,
            {
              backgroundColor: '#E5E7EB',
              borderRadius: Number.MAX_SAFE_INTEGER
            }
          ]}
        />
      </View>
    );
  }

  return (
    <View
      ref={viewRef}
      style={[styles.container, { width: size, height: size }]}
      onLayout={checkIfInView}
    >
      <View style={styles.innerRelativeContainer}>
        {isImageLoading && (
          <ShimmerLoader
            width={size}
            height={size}
            borderRadius={Number.MAX_SAFE_INTEGER}
          />
        )}
      </View>
      {imageSource && !error && (
        <Image
          resizeMode="cover"
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onError}
          source={imageSource}
          style={{
            width: size,
            height: size,
            borderRadius: Number.MAX_SAFE_INTEGER
          }}
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
