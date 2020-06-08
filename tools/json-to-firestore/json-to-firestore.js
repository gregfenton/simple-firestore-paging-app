/**
 * json-to-firestore.js
 * 
 * A utility that uploads data from a JSON file to a Firestore database.
 * 
 * Steps to get started:
 *   1. Have a Firebase account set up with a Firestore database
 *   2. Generate a Service Account key
 *       - Firebase Console (https://console.firebase.google.com/) >> YOUR_PROJECT >> Project Overview
 *           >> Users and Permissions >> Service Accounts >> "Generate new private key"
 *   3. Copy downloaded key file to json-to-firestore/serviceAccounts/serviceAccount.json
 *   4. Get database URL for your project
 *       - Firebase Console  >> YOUR_PROJECT >> Project Overview >> Project Settings
 *          >> Add App (or use existing one) >> Firebase SDK snippet >> Config
 *       - copy the `databaseURL` value
 *   5. Copy the `databaseURL` value into the `databaseURL` field passed to `admin.initializeApp()`
 *       - see "USE YOUR FIREBASE PROJECT SETTINGS" in this file, below
 *   6. Save.
 * 
 * To load 75 vehicles to your Firestore database, run the script
 *   1. cd json-to-firestore
 *   2. node json-to-firestore.js
 * 
 * NOTE: there is a 1000 vehicle dataset you can load by uncommenting the "1000-vehicles.json" line below,
 *       and commenting out the "75-vehicles.json" line.
 */ 

const admin = require("../../node_modules/firebase-admin");


// USE YOUR FIREBASE PROJECT SETTINGS:
const serviceAccount = require("./serviceAccounts/serviceAccount.json");
admin.initializeApp({
  databaseURL: "https://tick8s-test.firebaseio.com",
  credential: admin.credential.cert(serviceAccount),
});


const data = require("./75-vehicles.json");
// const data = require("./1000-vehicles.json");  //  <<<  if you want a lot more data in your FS database

const collectionKey = "vehicles"; //name of the collection
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
if (
  data &&
  typeof data === "object" &&
  data.vehicles &&
  typeof data.vehicles === "object"
) {
  data.vehicles.forEach((veh, idx) => {
    firestore
      .collection(collectionKey)
      .add(veh)
      .then((res) => {
        console.log(
          `Document ${veh.make} ${veh.model} ${veh.year} successfully written!`
        );
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  });
} else {
  console.error("ERROR: typeof data", typeof data);
  console.error("ERROR: typeof data.vehicles", typeof data.vehicles);
}
