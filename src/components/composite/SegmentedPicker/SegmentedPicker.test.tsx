import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SegmentedPicker, Segment } from '.';

const segments: Segment[] = [
  { id: '1', title: 'Segment 1', value: 1 },
  { id: '2', title: 'Segment 2', value: 2 },
  { id: '3', title: 'Segment 3', value: 3 }
];

describe('SegmentedPicker', () => {
  it('renders segments', () => {
    const { getByText } = render(
      <SegmentedPicker segments={segments} selectedSegment="1" />
    );

    segments.forEach((segment) => {
      expect(getByText(segment.title as string)).toBeDefined();
    });
  });

  it('calls onSelectSegment when a segment is pressed', () => {
    const onSelectSegment = jest.fn();
    const { getByText } = render(
      <SegmentedPicker
        segments={segments}
        selectedSegment="1"
        onSelectSegment={onSelectSegment}
      />
    );

    fireEvent.press(getByText(segments[1].title as string));
    expect(onSelectSegment).toHaveBeenCalledWith(segments[1]);
  });
});
