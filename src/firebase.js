// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa firestore desde Firebase

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLzjA1twZE_IfU2O6NUD9MFhQr0EruJxM",
  authDomain: "proyecto-final-de-ciclo-ace63.firebaseapp.com",
  projectId: "proyecto-final-de-ciclo-ace63",
  storageBucket: "proyecto-final-de-ciclo-ace63.appspot.com",
  messagingSenderId: "2392699271",
  appId: "1:2392699271:web:9fbd97e9cfdb7dd3182322",
  measurementId: "G-3EWRHSXY1L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firestore = getFirestore(app);

export const createUser = async (email, password) => {
    return createUserWithEmailAndPassword(getAuth(app), email, password);
}
  
export const signInUser = async (email, password) => {
    return signInWithEmailAndPassword(getAuth(app), email, password);
}

export const signOutUser = async () => {
    return signOut(getAuth(app));
}

export const getCurrentUser = () => {
    return getAuth(app).currentUser;
}
