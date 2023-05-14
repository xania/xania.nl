import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDqnfjEaAc7LPP6zWs6xqZfzYaFjPJk2M",
  authDomain: "xania-on-fire.firebaseapp.com",
  projectId: "xania-on-fire",
  storageBucket: "xania-on-fire.appspot.com",
  messagingSenderId: "287956370740",
  appId: "1:287956370740:web:25a178d796361459395161",
  measurementId: "G-H3BYB5N05S",
};

const app = initializeApp(firebaseConfig);
export const store = getFirestore(app);

export function insert(coll: string, id: string, body: any) {
  const subscriptionsCol = collection(store, coll);
  setDoc(doc(subscriptionsCol, id), body);
}
