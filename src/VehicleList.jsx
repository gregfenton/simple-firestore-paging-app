import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withFirestore } from "react-redux-firebase";
import useVehicleList, {FIRESTORE_META_ID} from "./useVehicleList";

const FIRST_PAGE = 0;
/**
 * @component  Displays a list of vehicles, growing the list a "page" at a time.
 * @example
 * const App = () => {
 *   return (
 *     <Provider store={store}>
 *       <ReactReduxFirebaseProvider {...rrfProps}>
 *         <ReduxFirestoreProvider {...rrfProps}>
 *           <VehicleList />
 *           <ReactFirestoreQueryLab />
 *         </ReduxFirestoreProvider>
 *       </ReactReduxFirebaseProvider>
 *     </Provider>
 *   );
 * };
 * @param {@} param0
 */
const VehicleList = ({ firestore }) => {
  const [pageSize, setPageSize] = useState(4);
  const [pageNum, setPageNum] = useState(FIRST_PAGE);
  const [queryText, setQueryText] = useState("");
  const [search, setSearch] = useState([]);

  const fakeDelayTime = 0;

  const [vehicles, hasMore, isLoading, error] = useVehicleList(
    firestore,
    pageNum,
    pageSize,
    search,
    fakeDelayTime
  );

  const runQuery = () => {
    setPageNum(FIRST_PAGE);
    if (queryText === "") {
      setSearch([]);
    } else {
      setSearch(["make", "==", queryText]);
    }
  };

  return (
    <>
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <button onClick={runQuery}>update query</button>
      </div>
      <div style={{ padding: "10px" }}>
        <label>Num of vehicles to fetch:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            setPageNum(FIRST_PAGE);
            setPageSize(parseInt(e.target.value));
          }}
        >
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>
      </div>
      <div style={{ padding: "10px" }}>
        {hasMore ? (
          <button onClick={(e) => setPageNum(currVal => currVal + 1)}>
            Fetch more &rarr;
          </button>
        ) : (
          <button disabled>No more to fetch</button>
        )}
      </div>
      <div style={{ padding: "10px" }}>
        {error ? <span style={{ color: "red" }}>error</span> : ""}
        <ol>
          {(vehicles.length > 0 &&
            vehicles.map((v) => (
              <li key={v.id}>
                {v.make}{" "}
                <code>
                  {" "}
                  || {v.model} || {v.package} || {v.transmission} || {v[FIRESTORE_META_ID]}
                </code>
              </li>
            ))) ||
            "no matches"}
        </ol>
        {isLoading ? (
          <div style={{ width: "100%", textAlign: "center" }}>Loading...</div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default compose(withFirestore, connect(null, null))(VehicleList);
