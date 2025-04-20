import { listenToComments } from "@/services/comment.service";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";

const CommentsScreen = () => {
  const { id } = useLocalSearchParams();
  const idTicket = id as string;
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idTicket) {
      const unsubscribeComments = listenToComments(idTicket, (data) => {
        setComments(data);
        setLoading(false);
      });
      return () => unsubscribeComments();
    }
  }, [idTicket]);

  if (loading) return <ActivityIndicator size="large" />;

  if (comments.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun commentaire</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {comments.map((comment, index) => (
        <View key={comment.id || index} style={{ marginBottom: 15 }}>
          <Text style={{ fontWeight: 'bold' }}>Le {comment.createdAt?.toDate().toLocaleString('fr-FR')}</Text>
          <Text>{comment.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CommentsScreen;