import Firebase from "firebase";


const firebaseConfig = {
  apiKey: "<API-key-goes-here>",
  authDomain: "<firebase-configuration-goes-here>",
  databaseURL: "<firebase-configuration-goes-here>",
  projectId: "<firebase-configuration-goes-here>",
  storageBucket: "<firebase-configuration-goes-here>",
  messagingSenderId: "<firebase-configuration-goes-here>",
  appId: "<firebase-configuration-goes-here>",
  measurementId: "<firebase-configuration-goes-here>"
};

const app = Firebase.initializeApp(firebaseConfig);
export const DB = app.database();