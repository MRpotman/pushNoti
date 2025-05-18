import { initializeApp } from "firebase/app";
import { getAuth , setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
 
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
