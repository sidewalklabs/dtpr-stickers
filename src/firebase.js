import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDVa2ls3tbEkeEPaKtX8T7P2izKAsPIr9w",
  authDomain: "stickers-7e1f1.firebaseapp.com",
  databaseURL: "https://stickers-7e1f1.firebaseio.com",
  projectId: "stickers-7e1f1",
  storageBucket: "stickers-7e1f1.appspot.com",
  messagingSenderId: "464780147561"
};
firebase.initializeApp(config);
export default firebase;