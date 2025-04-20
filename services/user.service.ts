import { db } from "@/config/config";
import { User } from "@/types/user";
import { dateOnly } from "@/utils/dateFormatter";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, where } from "firebase/firestore";



const getUserData = async(uid: string) =>{
    const userRef = doc(db, "Users", uid);
    const docSnapshot = await getDoc(userRef);
  
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return {
        email: data.email || "",
        fullName: data.fullName || "",
        departement: data.departement || "",
        role: data.role || "",
        
      };
    }
  
    throw new Error("Utilisateur introuvable dans la base de données.");
  }
  const listenToSupportUsers = (
    setUsers: (users: User[]) => void
  ) => {
    const userRef = collection(db, "Users");
    const q = query(userRef, where("role", "==", "support"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as User)
      }));
      setUsers(usersList);
    });
  
    return unsubscribe;
  };
   

  export { getUserData,listenToSupportUsers}