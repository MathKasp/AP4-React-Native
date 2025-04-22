import * as Notifications from 'expo-notifications';

 const notifyLocalAssignation = async (ticketTitle: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: " Assignation réussie",
      body: `Le ticket "${ticketTitle}" a été assigné avec succès.`,
      sound: "default",
    },
    trigger: null,
  });
};

const notifyLocalComment = async (ticketId: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nouveau commentaire détecté",
        body: `🔧 Le ticket "${ticketId}" vient d'être mis à jour ! Découvrez ce qui a changé.`,
        sound: "default",
      },
      trigger: null,
    });
  };
  const notifyLocalTicket = async (ticketTitle: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nouveau ticket",
        body: `Le ticket "${ticketTitle}" vient d'être ajouté`,
        sound: "default",
      },
      trigger: null,
    });
  };
  const notifyLocalEdit = async (ticketTitle: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Modification ticket",
        body: `Le ticket "${ticketTitle}" vient d'être mis à jour`,
        sound: "default",
      },
      trigger: null,
    });
  };

export {
    notifyLocalAssignation,
    notifyLocalComment,
    notifyLocalTicket,
    notifyLocalEdit
}