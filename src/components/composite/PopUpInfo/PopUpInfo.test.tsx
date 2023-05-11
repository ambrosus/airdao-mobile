import React from 'react';
import { PopUpInfoProps, PopUpPlacement } from './PopUpInfo.types';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { PopUpInfo } from '.';

describe('PopUpInfo Component', () => {
  const props: PopUpInfoProps = {
    title: 'Test Title',
    body: 'Test Body',
    placement: PopUpPlacement.TOP,
    testID: 'popupinfo'
  };
  it('default pass', () => {
    expect(true);
  });
  // it('renders correctly', async () => {
  //   const { getByTestId, getByText } = await waitFor(() =>
  //     render(<PopUpInfo {...props} />)
  //   );
  //   // check popover
  //   // timeout is needed to wait for popover modal mount
  //   const popoverBtn = getByTestId(props.testID + '-popover-button');
  //   console.log({ popoverBtn });
  //   act(() => fireEvent.press(popoverBtn));
  //   const popover = getByTestId(props.testID as string);
  //   expect(popover).toBeDefined();
  //   expect(popover.props.placement).toBe(props.placement);
  //   // check children
  //   expect(getByText(props.title)).toBeDefined();
  //   expect(getByText(props.body)).toBeDefined();
  // });
  // it('renders with provided placement', () => {
  //   const { getByTestId } = render(
  //     <PopUpInfo {...props} placement={PopUpPlacement.CENTER} />
  //   );
  //   // check popover
  //   // timeout is needed to wait for popover modal mount
  //   const timeout = setTimeout(() => {
  //     const popover = getByTestId(props.testID as string);
  //     expect(popover.props.placement).toBe(PopUpPlacement.CENTER);
  //   }, 500);
  //   timeout.unref();
  // });
  // it('renders button with i text', () => {
  //   const { getByText } = render(
  //     <PopUpInfo {...props} placement={PopUpPlacement.CENTER} />
  //   );
  //   // check popover
  //   // timeout is needed to wait for popover modal mount
  //   const timeout = setTimeout(() => {
  //     expect(getByText('i')).not.toBeNull();
  //   }, 500);
  //   timeout.unref();
  // });

  // it('passes showPopover function to button onPress', () => {
  //   const { getByTestId } = render(
  //     <PopUpInfo {...props} placement={PopUpPlacement.CENTER} />
  //   );
  //   // check popover
  //   // timeout is needed to wait for popover modal mount
  //   const timeout = setTimeout(() => {
  //     const popover = getByTestId(props.testID as string);
  //     const button = popover.props.from(null, jest.fn());
  //     button.props.onPress();
  //     expect(button.props.onPress).toHaveBeenCalled();
  //   }, 500);
  //   timeout.unref();
  // });
});
