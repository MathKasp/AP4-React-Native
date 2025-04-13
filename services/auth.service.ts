import { auth } from "@/config/config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";

export const signin = (
    email:string,
    password:string
):Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth,email,password)
}