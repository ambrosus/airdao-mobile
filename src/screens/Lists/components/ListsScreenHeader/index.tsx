import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacer } from '@components/atoms/Spacer';
import { BadgeButton } from '@components/BadgeButton/BadgeIconButton';
import { FilterButtonIcon } from '@components/svg/FilterButton';
import { SettingsButtonIcon } from '@components/svg/SettingsButtonIcon';
import { COLORS } from '../../../../constants/colors';
import { ListBottomStats } from '@screens/Lists/components/ListsScreenHeader/components/ListBottomStats';

export const ListsScreenHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.settingsButton}>
          <BadgeButton icon={<FilterButtonIcon />} />
        </View>
        <BadgeButton icon={<SettingsButtonIcon />} />
      </View>
      <Spacer value={9} />
      <Text style={styles.headerTextStyle}>Total list balance</Text>
      <Text style={styles.balanceHeaderStyle}>$3,900.90</Text>
      <ListBottomStats price="20,000 AMB" progress="3.46%" time="24HR" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    paddingRight: 17,
    justifyContent: 'flex-end'
  },
  settingsButton: {
    paddingRight: 16
  },
  headerTextStyle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 1
  },
  balanceHeaderStyle: {
    paddingTop: 24,
    paddingBottom: 12,
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.black
  },
  container: { paddingTop: 5, paddingLeft: 16 }
});
