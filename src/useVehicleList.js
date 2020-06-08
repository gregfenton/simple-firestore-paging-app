import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const FIRESTORE_META_ID = "__META_ID__";

/**
 * A custom hook to query the "vehicles" top collection of a Firestore database.
 *
 * @param {Firestore} firestore - instance of firestore, such as you get in props when a parent component is wrapped in `withFirestore()`
 * @param {number} pageNum - the current page number to fetch; first page is 0, second page is 1, etc...
 * @param {number} pageSize - number of records to fetch per page
 * @param {string} search - the parameters used in a `where` clause for Firestore; see example below
 * @param {number} [fakeDelayMillis=0] - the number of milliseconds to delay when fetching rows - meant purely for testing; set to 0 or omit to disable
 *
 * @returns {Object[]} loadedVehicles - all fetched vehicle records for the pages visited of this particular query
 * @returns {boolean} hasMore - if `true`, there are more records to be fetched
 * @returns {boolean} isLoading - indicates whether data is currently being fetched/loaded
 * @returns {string} error - error message should something go wrong; "" otherwise.
 *
 * @example
 *     const VehicleList = ({ firestore }) => {
 *       const [pageSize, setPageSize] = useState(4);
 *       const [pageNum, setPageNum] = useState(FIRST_PAGE);
 *       const [queryText, setQueryText] = useState("");
 *       const [search, setSearch] = useState([]);
 *
 *       const fakeDelayTime = 0;  // 0 (or not providing it) is off
 *
 *       const [vehicles, hasMore, isLoading, error] = useVehicleList(
 *         firestore,
 *         pageNum,
 *         pageSize,
 *         search,
 *         fakeDelayTime
 *       );
 *
 *       return (
 *         <ol>
 *           {(vehicles.length > 0 &&
 *             vehicles.map((v) => (
 *               <li key={v.id}> {v.make} || {v.model} || {v.package} || {v.transmission} </li>
 *             ))) ||
 *             "no matches"}
 *         </ol>
 *       );
 *     }
 *     export default withFirestore(VehicleList);
 *
 */
const useVehicleList = (
  firestore,
  pageNum,
  pageSize,
  search,
  fakeDelayMillis = 0
) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedVehicles, setLoadedVehicles] = useState([]);
  const [lastLoadedVehicle, setLastLoadedVehicle] = useState({});

  const mySleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const newlyLoaded = useSelector((state) => state.firestore.data.vlist);

  useEffect(() => {
    const processNewlyLoaded = () => {
      let retVal = [];
      for (let [key, values] of Object.entries(newlyLoaded)) {
        retVal.push({ [FIRESTORE_META_ID]: key, ...values });
      }
      setHasMore((currVal) => retVal.length === pageSize);
      setLoadedVehicles((currVal) => {
        let allVehicles = [...currVal, ...retVal];
        setLastLoadedVehicle(allVehicles[allVehicles.length - 1]);
        return allVehicles;
      });
      setIsLoading(false);
    };

    if (!newlyLoaded) return;

    processNewlyLoaded();
  }, [newlyLoaded, pageSize]);

  useEffect(() => {
    let query = "";
    setError("");
    setIsLoading(true);
    try {
      if (!pageNum) {
        setLoadedVehicles((currVal) => {
          return [];
        }); // clear them out
        console.log("Get a new result set!");
        // the first load
        if (!search || search.length === 0) {
          query = {
            collection: "vehicles",
            orderBy: [
              ["make", "asc"],
              ["model", "asc"],
            ],
            limit: pageSize,
            storeAs: "vlist",
          };
        } else {
          query = {
            collection: "vehicles",
            orderBy: [["model", "asc"]],
            where: search,
            limit: pageSize,
            storeAs: "vlist",
          };
        }
      } else {
        console.log("adding to result set");
        if (!search || search.length === 0) {
          query = {
            collection: "vehicles",
            orderBy: [
              ["make", "asc"],
              ["model", "asc"],
            ],
            startAfter: [lastLoadedVehicle.make, lastLoadedVehicle.model],
            limit: pageSize,
            storeAs: "vlist",
          };
        } else {
          query = {
            collection: "vehicles",
            orderBy: ["model", "asc"],
            where: search,
            startAfter: lastLoadedVehicle.model,
            limit: pageSize,
            storeAs: "vlist",
          };
        }
      }
      console.log("query is:", query);
      if (fakeDelayMillis) {
        mySleep(fakeDelayMillis).then(() => {
          firestore.onSnapshot(query);
        });
      } else {
        firestore.onSnapshot(query);
      }
    } catch (err) {
      console.error("ERROR FROM firestore.collection():", err);
      setError(err.message);
    }

    return () => firestore.unsetListener(query);
  }, [firestore, pageNum, pageSize, search, fakeDelayMillis]);

  return [loadedVehicles, hasMore, isLoading, error];
};

export default useVehicleList;
