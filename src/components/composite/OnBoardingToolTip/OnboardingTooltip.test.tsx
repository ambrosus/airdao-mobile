import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnBoardingToolTipBody } from './OnBoardingToolTipBody';

describe('OnBoardingToolTipBody Component', () => {
  const defaultProps = {
    title: 'Title',
    buttonLeftTitle: 'Left Button',
    isButtonLeftVisible: true,
    buttonRightTitle: 'Right Button',
    subtitle: 'Subtitle',
    handleButtonRightPress: jest.fn(),
    handleButtonLeftPress: jest.fn(),
    handleButtonClose: jest.fn()
  };

  it('renders correctly', () => {
    const { getByText } = render(<OnBoardingToolTipBody {...defaultProps} />);
    expect(getByText(defaultProps.title)).toBeDefined();
    expect(getByText(defaultProps.subtitle)).toBeDefined();
    expect(getByText(defaultProps.buttonLeftTitle)).toBeDefined();
    expect(getByText(defaultProps.buttonRightTitle)).toBeDefined();
  });

  it('calls handleButtonRightPress on button press', () => {
    const { getByText } = render(<OnBoardingToolTipBody {...defaultProps} />);
    fireEvent.press(getByText(defaultProps.buttonRightTitle));
    expect(defaultProps.handleButtonRightPress).toHaveBeenCalled();
  });

  it('calls handleButtonLeftPress on button press', () => {
    const { getByText } = render(<OnBoardingToolTipBody {...defaultProps} />);
    fireEvent.press(getByText(defaultProps.buttonLeftTitle));
    expect(defaultProps.handleButtonLeftPress).toHaveBeenCalled();
  });

  it('calls handleButtonClose on button press', () => {
    const { getByTestId } = render(<OnBoardingToolTipBody {...defaultProps} />);
    const closeButton = getByTestId('onboarding-close-button');
    fireEvent.press(closeButton);
    expect(defaultProps.handleButtonClose).toHaveBeenCalled();
  });

  it('does not render left button when isButtonLeftVisible is false', () => {
    const { queryByText } = render(
      <OnBoardingToolTipBody {...defaultProps} isButtonLeftVisible={false} />
    );
    expect(queryByText(defaultProps.buttonLeftTitle)).toBeNull();
  });
});
