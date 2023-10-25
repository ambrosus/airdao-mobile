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
            console.error('there was an error');
          }
        );
      });
      setMeasures(measureValues);
    });
  }, [refs]);

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
            fontSize={16}
            color={COLORS.neutral900}
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
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: scale(16)
        }}
        ref={containerRef}
      >
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputRangeIndex) =>
              inputRangeIndex === i ? 1 : 0.3
            )
          });
          return (
            <View
              key={i}
              style={{ marginRight: scale(16) }}
              testID="Portfolio_Screen_Tab_Item"
            >
              <PortfolioScreenTabItem
                onPress={props.onIndexChange}
                index={i}
                opacity={opacity}
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
    </>
  );
};
