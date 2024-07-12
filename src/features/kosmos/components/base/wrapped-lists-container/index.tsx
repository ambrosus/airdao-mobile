import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ListCellHeadings } from '../list-cell-headings';

export const WrappedListsContainer = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <ListCellHeadings />
      {children}
    </View>
  );
};
