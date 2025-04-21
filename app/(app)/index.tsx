import { Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Link, Redirect, useRootNavigationState, useRouter } from 'expo-router';
import { useAuth } from '@/context/ctx';
import { getAuth } from 'firebase/auth';
import Button from '@/components/ui/Button';
import { TextInput, IconButton, Button as Bt } from "react-native-paper";
import { useEffect, useState } from 'react';
import { getAllTickets } from '@/services/ticket.service';

export default function Index() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [ticketCount, setTicketCount] = useState(0);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const handleOpenList = () => {
    router.push(`/profile/utilisateurs`);
  }

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        try {
          setLoadingTickets(true);
          const tickets = await getAllTickets();
          // Filtrer les tickets en fonction de l'utilisateur connecter
          let userTickets = [];
          if (role === "employee") {
            // Tickets cree par l'employee
            userTickets = tickets.filter(ticket =>
              ticket.createdBy?.id === user?.uid
            );
          } else if (role === "support") {
            // Tickets assigne au support
            userTickets = tickets.filter(ticket =>
              ticket.assignedTo?.id === user?.uid
            );
          } else if (role === "admin") {
            userTickets = tickets;
          }
          setTicketCount(userTickets.length);
        } catch (error) {
          console.error("Erreur lors de la récupération des tickets:", error);
        } finally {
          setLoadingTickets(false);
        }
      }
    };

    fetchTickets();
  }, [user]);

  if (!user)
    return <Redirect href="/login" />

  const signOut = () => {
    const auth = getAuth();
    auth.signOut();
  }


  const goToTicketsIndex = () => {
    router.replace("/tickets");
  }

  return (
    <View style={styles.container}>
      <Text >Bienvenue</Text>
      <Text style={styles.welcome}>{user?.email}</Text>
      <Text style={styles.roleText}>Vous êtes connecté en tant que {role === "employee" ? "employé" : role}</Text>

      {loadingTickets ? (
        <ActivityIndicator size="small" color="#0066CC" />
      ) : (
        <>
          {role === "admin" && (
            <Text style={styles.label}>Vous avez {ticketCount} ticket(s) en cours</Text>
          )}
          {role === "support" && (
            <Text style={styles.label}>Vous avez {ticketCount} ticket(s) qui vous est assigné</Text>
          )}
          {role === "employee" && (
            <Text style={styles.label}>Vous avez {ticketCount} ticket(s)</Text>
          )}
        </>
      )}
      {role === "admin" && (
        <Bt
          mode="contained"
          onPress={handleOpenList}
          style={styles.actionButton}
          icon="account-group"
        >
          Gérer les utilisateurs
        </Bt>
      )}

      <Bt mode="text" onPress={signOut} style={styles.logoutButton}>
        Se déconnecter
      </Bt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20
  },
  actionButton: {
    marginBottom: 12,
    width: '80%',
  },
  logoutButton: {
    width: '80%',
  }
});