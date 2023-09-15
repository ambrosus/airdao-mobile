import { Button, Row, Text } from '@components/base';
import React from 'react';
import { COLORS } from '@constants/colors';
import { TextStyle, ViewStyle } from 'react-native';
import { styles as staticStyles } from './styles';

export interface Segment {
  id: string;
  title: string | React.ReactNode;
  value: unknown;
}

export interface SegmentedPickerProps {
  segments: Segment[];
  selectedSegment: string;
  styles?: {
    container?: ViewStyle;
    segment?: {
      selected?: ViewStyle;
      unselected?: ViewStyle;
    };
    segmentText?: {
      selected?: TextStyle;
      unselected?: TextStyle;
    };
  };
  disabled?: boolean;
  onSelectSegment?: (selectedSegment: Segment) => unknown;
}

export const SegmentedPicker = (props: SegmentedPickerProps): JSX.Element => {
  const {
    disabled = false,
    segments,
    selectedSegment,
    styles = {
      container: {},
      segment: {
        selected: {},
        unselected: {}
      },
      segmentText: {
        selected: {},
        unselected: {}
      }
    },
    onSelectSegment
  } = props;

  const renderSegment = (segment: Segment) => {
    const onPress = () => {
      if (typeof onSelectSegment === 'function') onSelectSegment(segment);
    };
    const selected = selectedSegment === segment.id;

    return (
      <Button
        disabled={disabled}
        testID={`SegmentButton_${segment.id}`}
        key={segment.id}
        onPress={onPress}
        style={{
          ...staticStyles.segment,
          ...(selected
            ? { ...staticStyles.selectedSegment, ...styles.segment?.selected }
            : { ...styles.segment?.unselected })
        }}
      >
        <Text
          style={
            selected
              ? { color: COLORS.brand500, ...styles.segmentText?.selected }
              : { ...styles.segmentText?.unselected }
          }
        >
          {segment.title}
        </Text>
      </Button>
    );
  };

  return (
    <Row
      alignItems="center"
      style={{ ...staticStyles.container, ...styles.container }}
    >
      {segments.map(renderSegment)}
    </Row>
  );
};
