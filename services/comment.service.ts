import { db } from "@/config/config";
import { dateOnly } from "@/utils/dateFormatter";
import { addDoc, collection, doc, getDocs, query, Timestamp, where } from "firebase/firestore";

const addComment = async ({
    ticketId,
    userId,
    content,
    attachmentUrl,
  }: {
    ticketId: string;
    userId: string;
    content: string;
    attachmentUrl?: string;
  }) => {
    const commentsRef = collection(db, "Comments");
  
    const newComment = {
      ticketId: doc(db, "Tickets", ticketId),
      userId: doc(db, "Users", userId),
      content,
      attachmentUrl: attachmentUrl || null,
      createdAt: Timestamp.fromDate(dateOnly),
    };
    await addDoc(commentsRef, newComment);
  };

  const getComments = async(idTicket: string) => {
    try {
    const commentsRef = collection(db, "Comments");
    const q = query(commentsRef, where("ticketId", "==", doc(db, "Tickets", idTicket)));
    const querySnapshot = await getDocs(q);
    const commentsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return commentsList;
  }catch (error){
    console.error("Erreur lors de la récupération des commentaires:", error);
    return [];
  }
  }
  export {addComment,getComments}