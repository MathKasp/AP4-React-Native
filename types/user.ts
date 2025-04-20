import { Timestamp } from "firebase/firestore";

 export interface User {
    userId:string,
    email: string;
    fullName: string;
    department: string;
    role: 'employee' | 'support' | 'admin'
    createdAt: Timestamp;
    lastLogin: Timestamp;
    avatarUrl?: string;
  }