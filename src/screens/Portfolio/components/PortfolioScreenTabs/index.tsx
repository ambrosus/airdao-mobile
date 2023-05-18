import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { scale } from '@utils/scaling';
import { Route } from '@react-navigation/native';
import { PortfolioScreenTabItem } from '@screens/Portfolio/components/PortfolioScreenTabs/components/PortfolioScreenTabItem';
import { PortfolioScreenTabIndicator } from '@screens/Portfolio/components/PortfolioScreenTabs/components/PortfolioScreenTabIndicator';
import { Measure } from '@screens/Portfolio/components/PortfolioScreenTabs/components/types';
import { TabViewProps } from 'react-native-tab-view';
import { useLists } from '@contexts';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';

type Props<T extends Route> = Parameters<
  NonNullable<TabViewProps<T>['renderPortfolioTab']>
>[0] & {
  onIndexChange: (index: number) => void;
  index: number;
};

export const PortfolioScreenTabs = <T extends Route>(props: Props<T>) => {
  const containerRef = useRef<View | null>(null);
  const inputRange = props.navigationState.routes.map((_, i) => i);
  const [measures, setMeasures] = useState<Measure[]>([]);

  const { handleOnCreate, createGroupRef } = useLists((v) => v);
  const handleOnOpenCreateNewList = useCallback(() => {
    createGroupRef.current?.show();
  }, [createGroupRef]);

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
      <View style={styles.container}>
        <Row justifyContent="space-between" alignItems="center">
          <Text
            fontFamily="Inter_700Bold"
            fontSize={16}
            color={COLORS.smokyBlack}
          >
            Portfolio
          </Text>
          {props.index === 0 ? (
            <Button
              onPress={handleOnOpenCreateNewList}
              style={{ justifyContent: 'center', height: 45, width: 109 }}
            >
              <Row>
                <AddIcon color={COLORS.deepBlue} />
                <Spacer horizontal value={scale(6.5)} />
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={14}
                  color={COLORS.deepBlue}
                >
                  Add address
                </Text>
              </Row>
            </Button>
          ) : (
            <Button
              onPress={handleOnOpenCreateNewList}
              style={{ justifyContent: 'center', height: 45, width: 138 }}
            >
              <Row>
                <AddIcon color={COLORS.deepBlue} />
                <Spacer horizontal value={scale(6.5)} />
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={14}
                  color={COLORS.deepBlue}
                >
                  Create collection
                </Text>
              </Row>
            </Button>
          )}
        </Row>
      </View>
      <Spacer value={12} />
      <View
        style={{
          flexDirection: 'row'
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
            <PortfolioScreenTabItem
              key={i}
              onPress={props.onIndexChange}
              index={i}
              opacity={opacity}
              ref={refs[i]}
            >
              {route.title}
            </PortfolioScreenTabItem>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16
  }
});
