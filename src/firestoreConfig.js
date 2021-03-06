import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; // <- needed if using firestore
import { createStore, combineReducers } from "redux";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore"; // <- needed if using firestore
import { firebaseReducer } from "react-redux-firebase";

export const configureStore = () => {
  const firebaseConfig = {
    // YOUR FIREBASE APP CONFIG
    //
    // Copy contents of firebaseConfig from:
    //   Log into Firebase Console (https://console.firebase.google.com/)
    //      >> YOUR_PROJECT
    //      >> Project Settings
    //      >> Add App (or use existing one)
    //      >> Firebase SDK snippet
    //      >> Config
  };

  const rrfConfig = {
    // These settings are optional, though quite useful(!)
    //     See https://react-redux-firebase.com/docs/recipes/profile.html#profile-in-firestore
    /*
    userProfile: "users",  // name of collection where profile information will be stored/retrieved
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    */
  };

  // Initialize firebase instance
  firebase.initializeApp(firebaseConfig);

  // Initialize other services on firebase instance
  firebase.firestore(); // <- needed if using firestore

  firebase
    .firestore()
    .enablePersistence()
    .catch(function(err) {
      if (err.code === "failed-precondition") {
        console.error(
          "STARTUP ERROR: Multiple tabs open, persistence can only be enabled in one tab at a a time(**)"
        );
      } else if (err.code === "unimplemented") {
        console.error("STARTUP ERROR: not supported on this browser");
      }
    });

  // Add firebase to reducers
  const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore
  });

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance, // <- needed if using firestore
  };

  return [store, rrfProps];
};
