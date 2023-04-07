import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA8jcEnPYvooJpFlsYse5atBob_d1Q8LIo",
    authDomain: "react-native-app-772e5.firebaseapp.com",
    databaseURL: "https://react-native-app-772e5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-native-app-772e5",
    storageBucket: "react-native-app-772e5.appspot.com",
    messagingSenderId: "1093042738262",
    appId: "1:1093042738262:web:5dcdbb7cd49d1651c317f7",
    measurementId: "G-ZTKEXXGGHZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    db,
}

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
