import { Text, View, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/config';

export default function Register() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Succès", "Inscription réussie !");
            router.replace("/login");
            // Redirection ou mise à jour de l'état après inscription
        }
        catch (error) {
            Alert.alert("Erreur", (error as Error).message);
        }
        setLoading(false);
    };


return (
    <View style={styles.container}>
        <Text style={styles.text}>Register Screen</Text>
        <Link href="/(auth)/login" style={styles.button}>
            Already have an account. Go to Login Screen
        </Link>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#000000',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});