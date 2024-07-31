import { initializeApp } from "firebase/app";

import {
  getFirestore,
  setDoc,
  addDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  snapshotEqual,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdj50oKHjaFmFGTHf-L4PtLuIhUMIB7Vw",
  authDomain: "trello-clone-52bdd.firebaseapp.com",
  projectId: "trello-clone-52bdd",
  storageBucket: "trello-clone-52bdd.appspot.com",
  messagingSenderId: "1046229877149",
  appId: "1:1046229877149:web:bb3dbf73336c16896fef74",
  measurementId: "G-GLMZ77EQVP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const Handlelogin = async () => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid;
      setDoc(doc(db, "users", user.uid), {
        name: "Tokyo",
        country: "Japan",
        id: `${userID}`,
      })
        .then((docRef) => {
          console.log(docRef);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(user);
    }
  });
  return unsubscribe;
};
