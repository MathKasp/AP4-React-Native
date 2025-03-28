import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Redirect, useRouter } from 'expo-router'; 
import { useAuth } from '@/context/ctx';

export default function Create() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log(user);

  if (!user)
    return <Redirect href="/login" />

  const goToTickets = () => {
    router.replace("/tickets")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ecran pour les warnings</Text>

      <Pressable onPress={goToTickets}>
        <Text style={{color:'#ff0000'}}>
          Accéder à l'espace des tickets
        </Text>
      </Pressable>
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
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});