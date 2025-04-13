import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, Redirect, useRootNavigationState, useRouter } from 'expo-router'; 
import { useAuth } from '@/context/ctx';
import { getAuth } from 'firebase/auth';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log(user);

  if (!user)
    return <Redirect href="/login" />

  const signOut = () => {
    const auth = getAuth();

    auth.signOut();
  }

  const goToTickets = () => {
    router.replace("/tickets")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard Screen</Text>
      <Pressable onPress={signOut}>
        <Text style={{color:'#fff'}}>
          Se déconnecter
        </Text>
      </Pressable>

      <Pressable onPress={goToTickets}>
        <Text style={{color:'#ff0000'}}>
          Accéder à l'espace des ticket
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