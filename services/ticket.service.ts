import { db } from "@/config/config";
import { collection, getDocs, addDoc, updateDoc, doc,getDoc, deleteDoc } from "firebase/firestore";

export interface Ticket {
  idTicket? : string;
  name: string;
  status: string;
  priority: string;
}
const getAllTickets = async (): Promise<Ticket[]> => {
  const ticketsCollection = collection(db, "Tickets");
  const snapshot = await getDocs(ticketsCollection);

  console.log("Raw snapshot:", snapshot.docs.map(doc => doc.data()));

  return snapshot.docs.map((doc) => ({
    idTicket: doc.id,
    ...(doc.data() as Ticket),
  }));
};


async function getTicketsDB() {
  console.log("Getting tickets from DB");

  const querySnapshot = await getDocs(collection(db, "Tickets"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}


const getDetailTicket = async (idTicket: string) => {
  try {
    if (!idTicket || typeof idTicket !== "string") {
      throw new Error("ID du ticket invalide.");
    }

    const ticketRef = doc(db, "Tickets", idTicket);
    const docSnap = await getDoc(ticketRef);

    if (!docSnap.exists()) {
      console.log(`Aucun ticket trouvé pour l'ID : ${idTicket}`);
      return null;
    }

    return docSnap.data();
  } catch (error) {
    console.log("Erreur lors de la récupération du ticket :", error);
    return null;
  }
};

//Création de tickets
const createTicket = async ({
  nameTicket,
  priorityTicket,
  statusTicket,
}: {
  nameTicket: string;
  priorityTicket: string;
  statusTicket: string;
}): Promise<Ticket> => {
  const ticketsCollection = collection(db, "Tickets");
   await addDoc(ticketsCollection, {
    name: nameTicket,
    priority: priorityTicket,
    status: statusTicket,
  });
  return {
    name: nameTicket,
    priority: priorityTicket,
    status: statusTicket,
  };
};



const deleteTicket = async (idTicket:string) : Promise<boolean> => {
  try {
    console.log(idTicket)

    await deleteDoc(doc(db, "Tickets", idTicket));
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return false;
  }
};

 const updateTicket = async ({
  idTicket,
  nameTicket,
  statusTicket,
  priorityTicket,
}: {
  idTicket: string;
  nameTicket: string;
  statusTicket: string;
  priorityTicket: string;
}) => {
  const ticketRef = doc(db, "Tickets", idTicket);

  await updateDoc(ticketRef, {
    name: nameTicket,  
    status: statusTicket, 
    priority: priorityTicket,
  });
};


export { getAllTickets, getTicketsDB, createTicket, getDetailTicket,deleteTicket,updateTicket };