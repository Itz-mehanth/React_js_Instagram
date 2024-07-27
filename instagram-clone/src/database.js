import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseApp = firebase.initializeApp({ 
  apiKey: "AIzaSyAY-09ZeUcTcSDGxnskvveS_pdZ8SrQ4T0",
  authDomain: "instagram-clone-react-ap-dbc00.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-ap-dbc00-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-ap-dbc00",
  storageBucket: "instagram-clone-react-ap-dbc00.appspot.com",
  messagingSenderId: "929628835790",
  appId: "1:929628835790:web:d3c4d3580503278509259f",
  measurementId: "G-NQYNY243TV"
});

const auth = firebase.auth();
const db = firebaseApp.firestore();
const storage = firebase.storage();

export {db, auth ,storage};