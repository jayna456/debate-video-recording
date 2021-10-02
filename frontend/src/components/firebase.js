import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAOeHejSJDOZp0T8wt4WsurvpgOxo6KEDU",
  authDomain: "",
  databaseURL: "https://debate-a622a.firebaseio.com/",
  projectId: "debate-a622a",
  storageBucket: "",
  messagingSenderId: "",
};

firebase.initializeApp(config);
export default firebase;
