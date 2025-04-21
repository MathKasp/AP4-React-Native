import { db } from "@/config/config";
import { User } from "@/types/user";
import { dateOnly } from "@/utils/dateFormatter";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";



const getUserData = async (uid: string) => {
  const userRef = doc(db, "Users", uid);
  const docSnapshot = await getDoc(userRef);

  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return {
      email: data.email || "",
      fullName: data.fullName || "",
      departement: data.departement || "",
      role: data.role || "",
      lastLogin: data.lastLogin || "",
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

const getAllUsers = async (): Promise<User[]> => {
  try {
      const usersRef = collection(db, "Users");
      const querySnapshot = await getDocs(usersRef);

      const users = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              userId: doc.id,
              email: data.email || "",
              fullName: data.fullName || "",
              department: data.departement || "",
              role: data.role || "",
              lastLogin: data.lastLogin || "",
              createdAt: data.createdAt || new Date().toISOString(),
          } as User;
      });

      return users;
  } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return [];
  }
};

const updateUser = async (userId: string): Promise<void> => {
  if (!userId) throw new Error("ID d'utilisateur manquant.");

  const userRef = doc(db, "Users", userId);

  await updateDoc(userRef, { role: "support" });
}
export { getUserData, listenToSupportUsers, updateUser, getAllUsers };