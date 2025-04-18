import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Alert, ActivityIndicator, StyleSheet, Button as RNButton } from "react-native";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { getDetailTicket, deleteTicket, updateTicket } from "@/services/ticket.service";
import AddTicketForm from "@/components/tickets/TicketForm";
import { TicketFirst } from "@/types/ticket";
import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
import AddCommentModal from "@/components/comments/commentForm";
import { useAuth } from "@/context/ctx";
import { addComment, getComments } from "@/services/comment.service";
import { comments } from "@/types/comments";
const TicketDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const idTicket = id as string;

  const [ticket, setTicket] = useState<TicketFirst | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [createdByUser, setCreatedByUser] = useState<string | null>(null);
  const { user, role } = useAuth()
  const [comments, setComments] = useState<comments[] | any>([]);



  useEffect(() => {
    if (idTicket) {
      setLoading(true);
      getDetailTicket(idTicket).then((data) => {
        if (data) setTicket(data as TicketFirst);
        setLoading(false);
      });
      getComments(idTicket).then((commentList) => {
        setComments(commentList)
      })
    }
  }, [idTicket]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (ticket?.createdBy && typeof ticket.createdBy !== "string") {
        try {
          const creatorRef = ticket.createdBy as DocumentReference<DocumentData>;
          const docSnap = await getDoc(creatorRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCreatedByUser(data?.fullName || "Nom non disponible");
          } else {
            setCreatedByUser("Utilisateur inconnu");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          setCreatedByUser("Erreur de récupération");
        }
      }
    };

    fetchCreator();
  }, [ticket?.createdBy]);

  const goToCommentsScreen = () => {
    router.push(`/tickets/${idTicket}/comments`);
  };

  const goToTicketsIndex = () => {
    router.replace("/tickets");
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };


  const handleSaveEdit = async (updatedTicket: TicketFirst) => {

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
            await updateTicket(idTicket, updatedTicket);

            const updated = await getDetailTicket(idTicket) as TicketFirst;
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

  const handleAddComment = async (text: string, image?: string) => {
    if (!user?.uid) {
      return Alert.alert("Erreur", "Utilisateur non connecté.");
    }
    
    try {
      await addComment({
        ticketId: idTicket,
        userId: user.uid,
        content: text,
        attachmentUrl: image,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire.");
    }
  };

  const hasComments = comments.length > 0;
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
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>{ticket.title}</Text>
        <Text>Description: {ticket.description}</Text>
        <Text>Status: {ticket.status}</Text>
        <Text>Priorité: {ticket.priority}</Text>
        <Text>category: {ticket.category}</Text>
        <Text>Créateur du ticket: {createdByUser}</Text>
        <Text>Date de création: {ticket.createdAt?.toDate().toLocaleString()}</Text>
        <Text>Date de la dernière mise à jour: {ticket.updatedAt?.toDate().toLocaleString('fr-FR')}</Text>
        {ticket.dueDate && (
          <Text>{ticket.dueDate.toDate().toLocaleString()}</Text>
        )}
        {ticket.location && (
          <Text>Coordonnées: {ticket.location}</Text>
        )}
        <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 20 }}>
          <Button theme="edit" label="Modifier" onPress={handleEdit} />
          <Button theme="delete" label="Supprimer" onPress={handleDelete} />

        </View>
        {role === "support" && (
          <RNButton title="Ajouter un commentaire" onPress={() => setCommentModalVisible(true)}></RNButton>

        )}

        {hasComments && (
          <RNButton title="Voir les commentaires" onPress={goToCommentsScreen} />
        )}
        <Button label="Retour à la liste" onPress={goToTicketsIndex} />
      </View>
      {commentModalVisible && (
        <AddCommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          onSave={(text) => { handleAddComment(text) }}
        />
      )}
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
    marginTop: 20
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
