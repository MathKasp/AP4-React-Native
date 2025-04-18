import { DocumentReference, Timestamp } from "firebase/firestore";

export interface TicketTrue {
    id?: string;
    title: string;
    description: string;
    status: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'hardware' | 'software' | 'network' | 'access' | 'other';
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
    status: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'hardware' | 'software' | 'network' | 'access' | 'other';
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