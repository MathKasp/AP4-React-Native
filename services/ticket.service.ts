import {db} from "@/config/config"
import { collection, getDocs } from "firebase/firestore"

interface Ticket {
    name: string;
    status: string;
    priority: string;
}

const getAllTickets = async (): Promise<Ticket[]> => {
    const ticketsCollection = collection(db,'tickets');
    const snapshot = await getDocs(ticketsCollection);
    return snapshot.docs.map((doc)=> ({
    id: doc.id,
    ...doc.data() as Ticket,
    }));
}

export {getAllTickets}