import { render } from '@testing-library/react-native';
import React from 'react';
import { Header } from '.';
import { View } from 'react-native';

describe('Header Component', () => {
  const testID = 'header';
  it('should render correctly', () => {
    const { getByTestId } = render(<Header testID={testID} />);
    const header = getByTestId(testID);
    expect(header).toBeDefined();
  });
  it('shoud show correct title string', () => {
    const { getByTestId } = render(<Header testID={testID} title="Title" />);
    const headerTitle = getByTestId(testID + '-title');
    expect(headerTitle).toBeDefined();
  });
  it('shoud render correct title view', () => {
    const { getByTestId } = render(
      <Header testID={testID} title={<View testID={testID + '-title'} />} />
    );
    const headerTitle = getByTestId(testID + '-title');
    expect(headerTitle).toBeDefined();
  });
  it('shoud hide back button when backIconVisible prop is false', () => {
    const { queryByTestId } = render(
      <Header testID={testID} backIconVisible={false} />
    );
    const backBtn = queryByTestId(testID + '-backIcon');
    expect(backBtn).toBe(null);
  });
  it('shoud render title on left when titlePosition props is left', () => {
    const { getByTestId } = render(
      <Header testID={testID} titlePosition="left" />
    );
    const titleOnLeft = getByTestId(testID + '-titleLeft');
    expect(titleOnLeft).toBeDefined();
  });
  it('should render contentLeft and contentRight', () => {
    const { getByTestId } = render(
      <Header
        testID={testID}
        contentLeft={<View testID="contentLeft" />}
        contentRight={<View testID="contentRight" />}
      />
    );
    const contentLeft = getByTestId('contentLeft');
    const contentRight = getByTestId('contentRight');
    expect(contentLeft).toBeDefined();
    expect(contentRight).toBeDefined();
  });
});
