import firebase from "firebase"; // Initail
import config from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
