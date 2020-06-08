import React from "react";
import { Provider } from "react-redux";
import {
  ReactReduxFirebaseProvider,
  ReduxFirestoreProvider,
} from "react-redux-firebase";

/* import ReactFirestoreQueryLab from "react-firestore-query-lab"; */

import VehicleList from "./VehicleList";

import { configureStore } from "./firestoreConfig";
const [store, rrfProps] = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <ReduxFirestoreProvider {...rrfProps}>
          <VehicleList />
          {/*   <ReactFirestoreQueryLab />      */}
        </ReduxFirestoreProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default App;
