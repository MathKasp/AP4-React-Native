import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TicketDetailLayout() {
    return <>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="comments" options={{ headerShown: false }} />
            <Stack.Screen name="assignation" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
    </>;
}