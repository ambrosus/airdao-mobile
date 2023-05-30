/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View
} from 'react-native';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetNotificationSettings } from '@components/templates';
import { BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import {
  BottomSheetFilter,
  NotificationsHeader as Header,
  NotificationBox
} from './components';
import {
  Notification,
  NotificationType,
  NotificationWithPriceChange
} from '@models/Notification';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { NotificationFilter } from '@appTypes/notification';

interface NotificationSection {
  title: string;
  data: Notification[];
  index: number;
}

const DAY_FORMAT = 'DD MMMM YYYY';

export const Notifications = (): JSX.Element => {
  const [filter, setFilter] = useState<NotificationFilter>({
    selectedDate: null,
    priceAlerts: true,
    walletUpdates: true,
    transactionAlerts: true,
    marketUpdates: true
  });

  const filterModal = useRef<BottomSheetRef>(null);
  const settingsModal = useRef<BottomSheetRef>(null);

  const notifications: Notification[] = [
    {
      _id: '1',
      type: NotificationType.WalletUpdate,
      body: 'Wallet 01 is up +6.54% ~$5,000 in the last 1 hour.',
      percentChange: 6.54,
      amount: 5000,
      createdAt: dayjs().subtract(5, 'seconds').toDate()
    } as NotificationWithPriceChange,
    {
      _id: '2',
      type: NotificationType.TransactionAlert,
      body: 'Wallet 01 received 30.654 AMB ~$50,000 to 0xe4...569C',
      createdAt: dayjs().subtract(5, 'minutes').toDate()
    },
    {
      _id: '3',
      type: NotificationType.PriceAlert,
      body: 'Yay! AMB price is up +10.56% ~$30,000',
      percentChange: 10.56,
      amount: 30000,
      createdAt: dayjs().subtract(25, 'hours').toDate()
    },
    {
      _id: '4',
      type: NotificationType.WalletUpdate,
      body: 'Your wallet is up +6.54% ~$5,000 in the last 1 hour.',
      percentChange: 6.54,
      amount: 5000,
      createdAt: dayjs().subtract(26, 'hours').toDate()
    } as NotificationWithPriceChange,
    {
      _id: '5',
      type: NotificationType.TransactionAlert,
      body: 'Wallet 01 received 30.654 AMB ~$50,000 to 0xe4...569C',
      createdAt: dayjs().subtract(38, 'hours').toDate()
    },
    {
      _id: '6',
      type: NotificationType.PriceAlert,
      body: 'Yay! AMB price is up +10.56% ~$30,000',
      percentChange: 10.56,
      amount: 30000,
      createdAt: dayjs().subtract(48, 'hours').toDate()
    }
  ];

  const sectionizedNotificaitons: NotificationSection[] = React.useMemo(() => {
    const sectionMap = new Map<string, Notification[]>();
    notifications.forEach((n) => {
      const key = dayjs(n.createdAt).format(DAY_FORMAT);
      const notificationsInSection = sectionMap.get(key) || [];
      notificationsInSection.push(n);
      sectionMap.set(key, notificationsInSection);
    });
    const sections: NotificationSection[] = [];
    let index = 0;
    for (const [date, notifications] of sectionMap) {
      const today = dayjs().format(DAY_FORMAT);
      const yesterday = dayjs().subtract(1, 'day').format(DAY_FORMAT);
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
            <Spacer value={verticalScale(32)} />
            <View style={styles.sectionSeparator} />
            <Spacer value={verticalScale(32)} />
          </>
        )}
        <Text fontFamily="Inter_600SemiBold" fontSize={13} color="#9E9E9E">
          {info.section.title.toUpperCase()}
        </Text>
        <Spacer value={verticalScale(20)} />
      </>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <View
          style={{
            height: scale(82),
            width: scale(82),
            borderRadius: scale(41),
            backgroundColor: '#F2F2F2'
          }}
        />
        <Spacer value={verticalScale(16)} />
        <Text align="center" color={COLORS.grey} fontSize={15} fontWeight="400">
          You have no notifications right now. Come back later.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView testID="NotificationScreen" style={styles.container}>
      <Header onSettingsPress={showSettingsModal} />
      <SectionList<Notification, NotificationSection>
        keyExtractor={(item) => item._id}
        sections={sectionizedNotificaitons}
        renderItem={renderNotification}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <Spacer value={verticalScale(32)} />}
        contentContainerStyle={styles.list}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      <BottomSheetFilter
        ref={filterModal}
        filter={filter}
        onSubmit={setFilter}
      />
      <BottomSheetNotificationSettings ref={settingsModal} />
    </SafeAreaView>
  );
};
