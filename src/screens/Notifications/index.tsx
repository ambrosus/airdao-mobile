import React, { useRef } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View
} from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetNotificationSettings } from '@components/templates';
import { BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { NotificationsHeader as Header, NotificationBox } from './components';
import { Notification } from '@models/Notification';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BellIcon } from '@components/svg/icons';
import { useNotificationsQuery } from '@hooks/query';
import { styles } from './styles';

interface NotificationSection {
  title: string;
  data: Notification[];
  index: number;
}

const DAY_FORMAT = 'DD MMMM YYYY';

export const Notifications = (): JSX.Element => {
  const { data: notifications } = useNotificationsQuery();

  // useEffect(() => {
  //   const databaseService = new DatabaseService();
  //   const unreadNotifications = notifications.filter((n) => !n.isRead);
  //   databaseService.markAsRead(unreadNotifications);
  // }, [notifications]);

  const settingsModal = useRef<BottomSheetRef>(null);

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
        date === today ? 'Today' : date === yesterday ? 'Yesterday' : date;
      sections.push({ title, data: notifications, index });
      index++;
    }
    return sections;
  }, [notifications]);

  const showSettingsModal = () => {
    settingsModal.current?.show();
  };

  const renderNotification = (
    args: SectionListRenderItemInfo<Notification>
  ) => {
    const { item } = args;
    return <NotificationBox notification={item} />;
  };

  const renderSectionHeader = (info: {
    section: SectionListData<Notification, NotificationSection>;
  }) => {
    return (
      <>
        {info.section.index !== 0 && (
          <>
            <Spacer value={verticalScale(40)} />
          </>
        )}
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={12}
          color={COLORS.smokyBlack50}
        >
          {info.section.title.toUpperCase()}
        </Text>
        <Spacer value={verticalScale(16)} />
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
          color={COLORS.davysGray}
          fontSize={15}
          fontFamily="Inter_400Regular"
        >
          You have no notifications right now.{'\n'} Come back later.
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
      <Header onSettingsPress={showSettingsModal} />
      <SectionList<Notification, NotificationSection>
        keyExtractor={(item) => item._id}
        sections={sectionizedNotificaitons}
        renderItem={renderNotification}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <Spacer value={32} />}
        contentContainerStyle={styles.list}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        testID="Notifications_List"
      />
      <BottomSheetNotificationSettings ref={settingsModal} />
    </SafeAreaView>
  );
};
