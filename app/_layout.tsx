import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/ctx';
import { Stack } from "expo-router";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Root() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(app)" options={{headerShown: false}} />
        <Stack.Screen name="+not-found" options={{headerShown: false}} />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
