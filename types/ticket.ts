import { DocumentReference, Timestamp } from "firebase/firestore";

export interface TicketTrue {
    id?: string;
    title: string;
    description: string;
    status: 'nouveau' | 'assigné' | 'en cours' | 'fermé';
    priority: 'bas' | 'moyen' | 'élevé' | 'critique';
    category: 'matériel' | 'logiciel' | 'réseau' | 'accès' | 'autre';
    createdBy: DocumentReference;
    assignedTo?: DocumentReference;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    dueDate?: Timestamp;
    location?: string;
    deviceInfo?: {
      model?: string;
      os?: string;
      version?: string;
    };
  }

  export interface TicketFirst {
    id?:string,
    title: string;
    description: string;
    status: 'nouveau' | 'assigné' | 'en cours' | 'fermé';
    priority: 'bas' | 'moyen' | 'élevé' | 'critique';
    category: 'matériel' | 'logiciel' | 'réseau' | 'accès' | 'autre';
    createdBy?: string| DocumentReference;
    assignedTo?: string |DocumentReference;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    dueDate?: Timestamp;
    location?: string;
    deviceInfo?: {
      model?: string;
      os?: string;
      version?: string;
    };
  }