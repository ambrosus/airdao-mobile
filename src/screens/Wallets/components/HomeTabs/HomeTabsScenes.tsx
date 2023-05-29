import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Platform, View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { PortfolioScreenTabItem } from '@screens/Portfolio/components/PortfolioScreenTabs/components/PortfolioScreenTabItem';
import { PortfolioScreenTabIndicator } from '@screens/Portfolio/components/PortfolioScreenTabs/components/PortfolioScreenTabIndicator';
import { Measure } from '@screens/Portfolio/components/PortfolioScreenTabs/components/types';
import { TabViewProps, Route } from 'react-native-tab-view';
import { scale, verticalScale } from '@utils/scaling';
import { BottomSheetRef } from '@components/composite';
import { BottomSheetCreateCollectionOrAddAddress } from '@components/templates/BottomSheetCreateCollectionOrAddAddress';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { ExploreTabNavigationProp } from '@appTypes';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { useLists } from '@contexts';

type Props<T extends Route> = Parameters<
  NonNullable<TabViewProps<T>['renderTabBar']>
>[0] & {
  onIndexChange: (index: number) => void;
  index: number;
};

export const HomeTabsScenes = <T extends Route>(props: Props<T>) => {
  const navigation = useNavigation<ExploreTabNavigationProp>();
  const { handleOnCreate } = useLists((v) => v);
  const containerRef = useRef<View | null>(null);
  const createCollectionOrAddAddressRef = useRef<BottomSheetRef>(null);
  const createRenameGroupRef = useRef<BottomSheetRef>(null);

  const { handleOnCreate } = useLists((v) => v);

  const inputRange = props.navigationState.routes.map((_, i) => i);
  const [measures, setMeasures] = useState<Measure[]>([]);

  const handleOnCreateCollectionOrAddAddress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.show();
  }, []);

  const handleOnAddNewAddress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.dismiss();

    setTimeout(
      () => navigation.navigate('Explore', { screen: 'ExploreScreen' }),
      400
    );
  }, [navigation]);

  const handleCreateCollectionPress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.dismiss();
    setTimeout(() => createRenameGroupRef.current?.show(), 400);
  }, []);

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

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: scale(24),
          alignItems: 'center',
          height: verticalScale(32)
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
            <View style={{ marginRight: scale(16) }} key={i}>
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
        <Spacer horizontal value={scale(Platform.OS === 'android' ? 24 : 12)} />
        <Button
          type="circular"
          onPress={handleOnCreateCollectionOrAddAddress}
          style={styles.addButton}
        >
          <AddIcon color={COLORS.white} scale={0.8} />
        </Button>
        <BottomSheetCreateCollectionOrAddAddress
          handleOnAddNewAddress={handleOnAddNewAddress}
          handleCreateCollectionPress={handleCreateCollectionPress}
          ref={createCollectionOrAddAddressRef}
        />
        <BottomSheetCreateRenameGroup
          type="create"
          ref={createRenameGroupRef}
          handleOnCreateGroup={handleOnCreate}
        />
      </View>
    </>
  );
};
