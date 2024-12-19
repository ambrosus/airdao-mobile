import React, { useRef } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { NotificationSettingsView } from '@components/templates';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { Notification } from '@models/Notification';
import { COLORS } from '@constants/colors';
import { BellIcon } from '@components/svg/icons';
import { useNotificationsQuery } from '@hooks/query';
import { DeviceUtils, verticalScale } from '@utils';
import { NotificationBox, NotificationsHeader } from './components';
import { styles } from './styles';

interface NotificationSection {
  title: string;
  data: Notification[];
  index: number;
}

const DAY_FORMAT = 'DD MMMM YYYY';

export const Notifications = (): JSX.Element => {
  const { data: notifications } = useNotificationsQuery();
  const { top: topInset } = useSafeAreaInsets();

  const settingsModal = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const sectionizedNotificaitons: NotificationSection[] = React.useMemo(() => {
    const sectionMap = new Map<string, Notification[]>();
    notifications.forEach((n) => {
      const key = moment(n.createdAt).format(DAY_FORMAT);
      const notificationsInSection = sectionMap.get(key) || [];
      notificationsInSection.push(n);
      sectionMap.set(key, notificationsInSection);
    });
    const sections: NotificationSection[] = [];
    let index = 0;
    for (const [date, notifications] of sectionMap) {
      const today = moment().format(DAY_FORMAT);
      const yesterday = moment().subtract(1, 'day').format(DAY_FORMAT);
      const title =
        date === today
          ? t('common.today')
          : date === yesterday
          ? t('common.yesterday')
          : date;
      sections.push({ title, data: notifications, index });
      index++;
    }
    return sections;
  }, [notifications, t]);

  const showSettingsModal = () => {
    settingsModal.current?.show();
  };

  const renderNotification = (
    args: SectionListRenderItemInfo<Notification>
  ) => {
    const { item: notification } = args;
    return <NotificationBox notification={notification} />;
  };

  const renderSectionHeader = (info: {
    section: SectionListData<Notification, NotificationSection>;
  }) => {
    return (
      <>
        {info.section.index !== 0 && (
          <>
            <Spacer value={verticalScale(28)} />
          </>
        )}
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={12}
          color={COLORS.alphaBlack50}
        >
          {info.section.title.toUpperCase()}
        </Text>
        <Spacer value={verticalScale(12)} />
      </>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer} testID="Empty_Component">
        <BellIcon />
        <Spacer value={verticalScale(16)} />
        <Text
          align="center"
          color={COLORS.neutral500}
          fontSize={15}
          fontFamily="Inter_400Regular"
        >
          {t('empty.notifications')}
          {'\n'}
          {t('empty.notifications.check.later')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      testID="NotificationScreen"
      style={styles.container}
    >
      <NotificationsHeader onSettingsPress={showSettingsModal} />
      <SectionList<Notification, NotificationSection>
        keyExtractor={(item) => item._id}
        sections={sectionizedNotificaitons}
        renderItem={renderNotification}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <Spacer value={verticalScale(8)} />}
        contentContainerStyle={styles.list}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        testID="Notifications_List"
      />
      <BottomSheet ref={settingsModal} height={'100%'} borderRadius={0}>
        {DeviceUtils.isIOS && <Spacer value={topInset} />}
        <Header
          bottomBorder
          title={t('tab.settings')}
          style={{
            shadowColor: 'transparent',
            zIndex: 1000
          }}
          onBackPress={() => settingsModal.current?.dismiss()}
        />
        <NotificationSettingsView />
      </BottomSheet>
    </SafeAreaView>
  );
};
