import * as Notifications from 'expo-notifications';

export const notifyLocal = async (ticketId: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✅ Assignation réussie",
      body: `Le ticket n°${ticketId} a été assigné avec succès.`,
      sound: "default",
    },
    trigger: null,
  });
};