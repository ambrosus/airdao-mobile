import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from '.';
import { DEFAULT_FONT_SIZE } from './Text.constants';

describe('Text Component', () => {
  it('should render correctly with default props', () => {
    const textContent = 'Hello World!';
    const { getByText } = render(<Text testID="text">{textContent}</Text>);
    const text = getByText(textContent);
    expect(text).toBeDefined();
    expect(text.props.style).toHaveProperty('fontSize', DEFAULT_FONT_SIZE);
    expect(text.props.style).toHaveProperty('fontWeight', '400');
    expect(text.props.style).toHaveProperty('opacity', 1);
    expect(text.props.style).toHaveProperty('textAlign', 'auto');
  });
  it('should render correctly with specified font size', () => {
    const textContent = 'Hello World!';
    const TEST_FONT_SIZE = 20;
    const { getByTestId } = render(
      <Text testID="text" fontSize={TEST_FONT_SIZE}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('fontSize', TEST_FONT_SIZE);
  });
  it('should render correctly with specified font family', () => {
    const textContent = 'Hello World!';
    const TEST_FONT_FAMILY = 'Inter_700Bold';
    const { getByTestId } = render(
      <Text testID="text" fontFamily={TEST_FONT_FAMILY}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('fontFamily', TEST_FONT_FAMILY);
  });
  it('should render correctly with specified font weight', () => {
    const textContent = 'Hello World!';
    const TEST_FONT_WEIGHT = '600';
    const { getByTestId } = render(
      <Text testID="text" fontWeight={TEST_FONT_WEIGHT}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('fontWeight', TEST_FONT_WEIGHT);
  });
  it('should render correctly with specified opacity', () => {
    const textContent = 'Hello World!';
    const TEST_OPACITY = 0.5;
    const { getByTestId } = render(
      <Text testID="text" opacity={TEST_OPACITY}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('opacity', TEST_OPACITY);
  });
  it('should render correctly with specified color', () => {
    const textContent = 'Hello World!';
    const TEST_COLOR = 'red';
    const { getByTestId } = render(
      <Text testID="text" color={TEST_COLOR}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('color', TEST_COLOR);
  });
  it('should render correctly with specified textAlign', () => {
    const textContent = 'Hello World!';
    const TEST_ALIGN = 'justify';
    const { getByTestId } = render(
      <Text testID="text" align={TEST_ALIGN}>
        {textContent}
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('textAlign', TEST_ALIGN);
  });
  it('should apply fix for misplacement for certain fonts on IOS', () => {
    const { getByTestId } = render(
      <Text testID="text" fontFamily="Mersad_600SemiBold" fontSize={16}>
        Hello World
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.style).toHaveProperty('lineHeight', 22.4);
    expect(text.props.style).toHaveProperty('height', 16);
  });
  it('should pass additional props to the underlying RNText component', () => {
    const { getByTestId } = render(
      <Text testID="text" onPress={() => undefined}>
        Hello World
      </Text>
    );
    const text = getByTestId('text');
    expect(text.props.onPress).toBeDefined();
  });
});
