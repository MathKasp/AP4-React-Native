import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, Redirect, useRootNavigationState, useRouter } from 'expo-router'; 
import { useAuth } from '@/context/ctx';
import { getAuth } from 'firebase/auth';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log(user);

  if (!user)
    return <Redirect href="/login" />

  const signOut = () => {
    const auth = getAuth();

    auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>index Screen</Text>
      <Link href="/(auth)/login" style={styles.button}>
        Already have an account. Go toooooooooooooo
      </Link>
      <Pressable onPress={signOut}>
        <Text style={{color:'#fff'}}>
          Se déconnecter
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