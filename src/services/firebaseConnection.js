
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAVLvO5N9FQRRkXY6In1Rnk3uV3RSGx9DI",
    authDomain: "banaweb-89458.firebaseapp.com",
    projectId: "banaweb-89458",
    storageBucket: "banaweb-89458.appspot.com",
    messagingSenderId: "789253375197",
    appId: "1:789253375197:web:ff1899d266087873fe4734",
    measurementId: "G-3DNL7K0998"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };