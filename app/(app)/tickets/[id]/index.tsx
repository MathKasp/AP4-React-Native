import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Alert, ActivityIndicator,StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { getDetailTicket, Ticket,deleteTicket,updateTicket  } from "@/services/ticket.service"; 
import AddTicketForm from "@/components/tickets/TicketForm";
const TicketDetails = ({ refreshTickets }: { refreshTickets: () => void }) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const idTicket = id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    if (idTicket) {
      setLoading(true);
      getDetailTicket(idTicket).then((data) => {
        if (data) setTicket(data as Ticket);
        setLoading(false);
      });
    }
  }, [idTicket]);

  const goToTicketsIndex = () => {
    router.replace("/tickets");
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedTicket: Ticket) => {
    
    if (!updatedTicket || !idTicket) return;
  
    Alert.alert(
      "Confirmer la modification",
      "Êtes-vous sûr de vouloir modifier ce ticket ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Enregistrer",
          style: "destructive",
          onPress: async () => {
  
            await updateTicket({
              idTicket: idTicket,
              nameTicket: updatedTicket.name,
              statusTicket: updatedTicket.status,
              priorityTicket: updatedTicket.priority,
            });
  
            // Récupération du ticket mis à jour
            const updated = await getDetailTicket(idTicket) as Ticket;
            if (updated) {
              setTicket(updated);
              console.log("Ticket mis à jour avec succès:", updated);
            } else {
              console.log("Erreur : Le ticket mis à jour n'a pas pu être récupéré.");
            }
  
            setIsEditModalVisible(false);
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le ticket",
      "Voulez-vous vraiment supprimer ce ticket ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const checker = await deleteTicket(idTicket)
            if (checker) {
              setTicket(null);
              setLoading(true);
              
              goToTicketsIndex()

            }
          },
        },
      ]
    );
  };
  if (!ticket) return <Text style={{ textAlign: "center", marginTop: 20 }}>Veuillez sélectionner un ticket dans la liste</Text>;

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>{ticket.name}</Text>
        <Text>Status: {ticket.status}</Text>
        <Text>Priorité: {ticket.priority}</Text>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <Button theme="edit" label="Modifier" onPress={handleEdit}  />
          <Button theme="delete" label="Supprimer" onPress={handleDelete}  />
        </View>

        <Button label="Retour à la liste" onPress={goToTicketsIndex} />
      </View>
      {isEditModalVisible && (
        <AddTicketForm
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveEdit}
          initialTicket={ticket} 
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  returnBt: {
   marginTop : 20
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
export default TicketDetails;
