import React, { useRef } from 'react';
import {
  Platform,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
  useWindowDimensions
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
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BellIcon } from '@components/svg/icons';
import { useNotificationsQuery } from '@hooks/query';
import { NotificationsHeader, NotificationBox } from './components';
import { styles } from './styles';

interface NotificationSection {
  title: string;
  data: Notification[];
  index: number;
}

const DAY_FORMAT = 'DD MMMM YYYY';

export const Notifications = (): JSX.Element => {
  const { data: notifications } = useNotificationsQuery();
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
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
          ? t('today')
          : date === yesterday
          ? t('yesterday')
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
          color={COLORS.alphaBlack50}
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
          color={COLORS.neutral500}
          fontSize={15}
          fontFamily="Inter_400Regular"
        >
          {t('no.notifications.text')}
          {'\n'}
          {t('no.notifications.come.back.later.text')}.
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
        ItemSeparatorComponent={() => <Spacer value={verticalScale(16)} />}
        contentContainerStyle={styles.list}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        testID="Notifications_List"
      />
      <BottomSheet ref={settingsModal} height={WINDOW_HEIGHT} borderRadius={0}>
        {Platform.OS === 'ios' && <Spacer value={topInset} />}
        <Header
          title={t('notification.settings')}
          style={{
            shadowColor: 'transparent',
            zIndex: 1000,
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10)
          }}
          titlePosition={Platform.select({ ios: 'left', default: 'center' })}
          backIconVisible={true}
          onBackPress={() => settingsModal.current?.dismiss()}
        />
        <NotificationSettingsView />
      </BottomSheet>
    </SafeAreaView>
  );
};
