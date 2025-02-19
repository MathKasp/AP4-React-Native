import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFound() {
    return (
        <>
            <Stack.Screen options={{ title: 'Not Found' }} />
            <View style={styles.container}>
                <Link href="/" style={styles.button}>Go to Home</Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        color: "#fff",
        marginTop: 20
    }
});