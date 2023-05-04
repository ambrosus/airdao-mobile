import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ListsScreen } from '@screens/Lists';
import { useLists } from '@contexts/ListsContext';
jest.mock('@helpers/createContextSelector', () => ({
  createContextSelector: () => [{}, jest.fn()]
}));

jest.mock('@contexts/ListsContext', () => ({
  useLists: () => ({
    listsOfAddressGroup: [{}, {}]
  })
}));
describe('ListsScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<ListsScreen />);
    expect(getByTestId('lists-screen')).toBeTruthy();
  });

  it('displays the total amount correctly', () => {
    const { getByTestId } = render(<ListsScreen />);
    const totalAmount = getByTestId('lists-screen-total-amount').props.children;
    expect(totalAmount).toEqual('0');
  });

  it('displays the "Create new list" button', () => {
    const { getByText } = render(<ListsScreen />);
    const button = getByText('Create new list');
    expect(button).toBeTruthy();
  });

  it('opens the create group bottom sheet when the "Create new list" button is pressed', () => {
    const { getByText, getByTestId } = render(<ListsScreen />);
    const button = getByText('Create new list');
    fireEvent.press(button);
    const bottomSheet = getByTestId('bottom-sheet-create-rename-group');
    expect(bottomSheet.props.visible).toBe(true);
  });

  it('displays the "EmptyListsOfGroups" component when there are no lists of address groups', () => {
    const { getByTestId } = render(<ListsScreen />);
    const emptyComponent = getByTestId('empty-lists-of-groups');
    expect(emptyComponent).toBeTruthy();
  });

  it('displays the "ListsGroups" component when there are lists of address groups', () => {
    const { getByTestId } = render(<ListsScreen />);
    const groupsComponent = getByTestId('lists-groups');
    expect(groupsComponent).toBeTruthy();
  });
});
