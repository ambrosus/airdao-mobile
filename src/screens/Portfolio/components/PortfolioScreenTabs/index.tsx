import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { PortfolioScreenTabItem } from './components/PortfolioScreenTabItem';
import { PortfolioScreenTabIndicator } from './components/PortfolioScreenTabIndicator';
import { Measure } from './components/types';
import { TabViewProps, Route } from 'react-native-tab-view';
import { useLists } from '@contexts';
import { BottomSheetCreateRenameGroup } from '@components/templates';
import { SearchTabNavigationProp } from '@appTypes';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { DEVICE_WIDTH } from '@constants/variables';

type Props<T extends Route> = Parameters<
  NonNullable<TabViewProps<T>['renderTabBar']>
>[0] & {
  onIndexChange: (index: number) => void;
  index: number;
};

export const PortfolioScreenTabs = <T extends Route>(props: Props<T>) => {
  const containerRef = useRef<View | null>(null);

  const inputRange = props.navigationState.routes.map((_, i) => i);
  const [measures, setMeasures] = useState<Measure[]>([]);

  const { t } = useTranslation();

  const { handleOnCreate, createGroupRef } = useLists((v) => v);
  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);

  const navigation = useNavigation<SearchTabNavigationProp>();

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search', { screen: 'SearchScreen' });
  }, [navigation]);

  const refs = useMemo(
    () =>
      [...new Array(props.navigationState.routes.length)].map(() =>
        React.createRef<View>()
      ),
    [props.navigationState.routes.length]
  );

  const tabWidth = DEVICE_WIDTH;
  const tabBarWidth = tabWidth / 2;

  const indicatorPosition = useSharedValue(0);
  // @ts-ignore
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(indicatorPosition.value, {
            duration: 50
          })
        }
      ]
    };
  });

  useEffect(() => {
    const measureValues: Measure[] = [];
    setTimeout(() => {
      refs.forEach((r) => {
        if (!r.current) {
          return;
        }
        r.current.measureLayout(
          containerRef.current as any,
          (x, y, width, height) => {
            measureValues.push({
              x,
              y,
              width,
              height
            });
          },
          () => {
            // tslint:disable-next-line:no-console
            console.error('there was an error');
          }
        );
      });
      setMeasures(measureValues);
    });
  }, [refs]);

  useEffect(() => {
    indicatorPosition.value = withTiming(props.index * tabBarWidth);
  }, [indicatorPosition, props.index, tabBarWidth]);

  const portfolioTabsButton = () => {
    if (props.index === 0) {
      navigateToSearch();
    } else {
      handleOnOpenCreateNewList();
    }
  };

  return (
    <>
      <View style={styles.container} testID="Portfolio_Screen_Tabs">
        <Row justifyContent="space-between" alignItems="center">
          <Text
            fontFamily="Inter_700Bold"
            fontSize={24}
            fontWeight="700"
            color={COLORS.neutral800}
          >
            {t('tab.watchlist')}
          </Text>
          <Button
            testID="Portfolio_Tabs_Button"
            onPress={portfolioTabsButton}
            style={styles.createNewListButton}
          >
            <Row>
              <Spacer horizontal value={scale(6.5)} />
              <Text
                fontFamily="Inter_500Medium"
                fontSize={14}
                color={COLORS.brand500}
              >
                {props.index === 0
                  ? t('collection.add.address')
                  : t('collection.create')}
              </Text>
            </Row>
          </Button>
        </Row>
      </View>
      <Spacer value={verticalScale(27)} />
      <View style={styles.itemContainer} ref={containerRef}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputRangeIndex) =>
              inputRangeIndex === i ? 1 : 0.3
            )
          });
          const color =
            props.navigationState.index === i
              ? COLORS.brand500
              : COLORS.neutral900Alpha['60'];
          return (
            <View key={i} testID="Portfolio_Screen_Tab_Item">
              <PortfolioScreenTabItem
                onPress={(idx) => {
                  indicatorPosition.value = withTiming(idx * tabBarWidth);
                  props?.onIndexChange(idx);
                }}
                index={i}
                opacity={opacity}
                color={color}
                ref={refs[i]}
              >
                {route.title}
              </PortfolioScreenTabItem>
            </View>
          );
        })}
        {measures.length > 0 && (
          <PortfolioScreenTabIndicator
            measures={measures}
            position={props.position}
            navigationState={props.navigationState}
          />
        )}
      </View>
      <BottomSheetCreateRenameGroup
        type="create"
        handleOnCreateGroup={handleOnCreate}
        ref={createGroupRef}
      />
      <Spacer value={verticalScale(5)} />
      <View style={styles.tabsIndicatorWrapper}>
        <Animated.View
          style={[
            {
              ...styles.tabsIndicator,
              width: tabWidth / 2
            },
            indicatorStyle
          ]}
        />
      </View>
      <Spacer value={verticalScale(10)} />
    </>
  );
};
