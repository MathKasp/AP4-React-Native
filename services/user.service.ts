import { db } from "@/config/config";
import { User } from "@/types/user";
import { dateOnly } from "@/utils/dateFormatter";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";

const getUsers = async (): Promise<User[]> => {
    const usersCollection = collection(db, "Users");
    const snapshot = await getDocs(usersCollection);
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as User),
    }));
  };

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

   

  export {getUsers, getUserData}