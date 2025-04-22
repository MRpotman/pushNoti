import { initializeApp } from "firebase/app";
import { getAuth , setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyD1v3nhwVcp6xahByLgiv2nQJDv0WqpKCQ",
  authDomain: "tareass-b88e3.firebaseapp.com",
  projectId: "tareass-b88e3",
  storageBucket: "tareass-b88e3.firebasestorage.app",
  messagingSenderId: "187896811281",
  appId: "1:187896811281:web:a371c889bffd7c457046b0",
  measurementId: "G-5WHP8DLFQP"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia configurada correctamente.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia:", error);
  });
 
export { auth, db, messaging, authReady };