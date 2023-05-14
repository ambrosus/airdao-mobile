import { Button, Row, Text } from '@components/base';
import React from 'react';
import { styles } from './styles';

export interface Segment {
  id: string;
  title: string | React.ReactNode;
  value: unknown;
}

export interface SegmentedPickerProps {
  segments: Segment[];
  selectedSegment: string;
  onSelectSegment?: (selectedSegment: Segment) => unknown;
}

export const SegmentedPicker = (props: SegmentedPickerProps): JSX.Element => {
  const { segments, selectedSegment, onSelectSegment } = props;

  const renderSegment = (segment: Segment) => {
    const onPress = () => {
      if (typeof onSelectSegment === 'function') onSelectSegment(segment);
    };
    const selected = selectedSegment === segment.id;

    return (
      <Button
        testID={`SegmentButton_${segment.id}`}
        key={segment.id}
        onPress={onPress}
        style={{
          ...styles.segment,
          ...(selected ? styles.selectedSegment : {})
        }}
      >
        <Text>{segment.title}</Text>
      </Button>
    );
  };

  return (
    <Row alignItems="center" style={styles.container}>
      {segments.map(renderSegment)}
    </Row>
  );
};
