import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {  listenToSupportUsers } from "@/services/user.service"; // ta fonction corrigée plus haut
import { User } from "@/types/user";
import { assignSupportToTicket } from "@/services/ticket.service"; // à créer si nécessaire

const AssignSupportScreen = () => {
  const { id } = useLocalSearchParams();
  const idTicket = id as string;
  const router = useRouter();
  const [supportUsers, setSupportUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToSupportUsers((users) => {
      setSupportUsers(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleAssign = async (user: User) => {

    if (!idTicket || typeof idTicket !== "string") return;
    try {
      await assignSupportToTicket(idTicket, user.userId);
      Alert.alert("Succès", `${user.fullName} a été assigné au ticket.`);
      router.back(); 
    } catch (error) {
      Alert.alert("Erreur", "Impossible d’assigner l’utilisateur.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigner un support</Text>
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={supportUsers}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <Pressable style={styles.userCard} onPress={() => handleAssign(item)}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  userCard: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
});

export default AssignSupportScreen;