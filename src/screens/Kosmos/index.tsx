import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { ActiveMarketsWithFilters } from '@features/kosmos/components/templates';

export const KosmosScreen = () => {
  return (
    <SafeAreaView>
      <Header
        title="Kosmos"
        style={styles.header}
        leftContainerStyles={styles.leftContainerStyles}
        rightContainerStyles={styles.rightContainerStyles}
        titleStyle={styles.heading}
        titlePosition="left"
        backIconVisible={false}
      />

      <View style={styles.container}>
        <ActiveMarketsWithFilters />
      </View>
    </SafeAreaView>
  );
};
