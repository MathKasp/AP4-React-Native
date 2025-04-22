import { notifyLocalComment } from "@/components/notification/localNotification";
import { db } from "@/config/config";
import { comments } from "@/types/comments";
import { dateOnly } from "@/utils/dateFormatter";
import { addDoc, collection, doc, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";

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
      createdAt: Timestamp.fromDate(new Date),
    };
    await addDoc(commentsRef, newComment);
    await notifyLocalComment(ticketId)
  };

   const listenToComments = (ticketId: string, setComments: (comments: comments[]) => void) => {
    if (!ticketId) {
      console.error("ID du ticket invalide");
      return () => {}; 
    }
    const ticketRef = doc(db, "Tickets", ticketId)
    const commentsCollection = collection(db, "Comments");
    const commentsQuery = query(commentsCollection, where("ticketId", "==", ticketRef));
  
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => doc.data() as comments);
      setComments(commentList);
    });
  
    return unsubscribeComments;  
  };
  export {addComment,listenToComments}