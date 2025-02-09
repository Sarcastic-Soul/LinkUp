import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIWwxgiURstzoepUp9stsE2TqmWp3NKis",
    authDomain: "react-native-chat-app-5b8a5.firebaseapp.com",
    projectId: "react-native-chat-app-5b8a5",
    storageBucket: "react-native-chat-app-5b8a5.firebasestorage.app",
    messagingSenderId: "330874905659",
    appId: "1:330874905659:web:a7aa544216e1eb351e681e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const usersRef = collection(db, 'users');
export const roomsRef = collection(db, 'rooms');