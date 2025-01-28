import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ListCellHeadings } from '../list-cell-headings';

export const WrappedListsContainer = ({
  children,
  table = false
}: {
  children: ReactNode;
  table?: boolean;
}) => {
  return (
    <View style={styles.container}>
      {table && <ListCellHeadings />}
      {children}
    </View>
  );
};
