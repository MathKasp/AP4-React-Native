import React, { useState } from "react";
import {router} from 'expo-router'
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, IconButton,Button as Bt } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/config";
import { Link, useRouter } from "expo-router";
import Button from "@/components/ui/Button";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);


  const goToRegister = () => {
    router.push("/(auth)/register");
  }
  const goTodashboard = () => {
    router.replace("/dashboard");
  }
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Connexion réussie !");
      router.replace("/dashboard")
      // Redirection ou mise à jour de l'état après connexion
    } catch (error) {
      Alert.alert("Erreur", (error as Error).message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button label=" Je suis tout pâle" onPress={goTodashboard}/>
      <Button label=" toiiiiiiiiiiii"theme="primary" onPress={goToRegister}/>
      <TextInput
        label="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureText}
          autoCapitalize="none"
          style={styles.passwordInput}
        />
        <IconButton
          icon={secureText ? "eye-off" : "eye"}
          onPress={() => setSecureText(!secureText)}
        />
      </View>

      <Bt
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Se connecter
      </Bt>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  input: {
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    marginTop: 20,
  },
});

export default LoginScreen;