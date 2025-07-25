import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQN-jFPCh7BEytOmKpxUctgl6-UD8FBgI",
  authDomain: "kanban-flow-7da19.firebaseapp.com",
  projectId: "kanban-flow-7da19",
  storageBucket: "kanban-flow-7da19.appspot.com",
  messagingSenderId: "735024869461",
  appId: "1:735024869461:web:7f2ade15879a2eea29a4dc",
  measurementId: "G-2RFZPV9XZH",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
