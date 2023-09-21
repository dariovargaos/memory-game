import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, Timestamp } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig: object = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

//init firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

//init firestore db
const db: Firestore = getFirestore(app);

//init firebase auth
const auth: Auth = getAuth(app);

//init firebase storage
const storage = getStorage();

//init timestamp
const timestamp = Timestamp;

export { db, auth, storage, timestamp };
