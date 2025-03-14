import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Sign Up
export const signUp = (email, password) => {
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Promise.reject("Invalid email or password type");
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const signIn = (email, password) => {
  console.log("Signing in with email:", email);
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Promise.reject("Invalid email or password type");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign Out
export const logOut = () => signOut(auth);