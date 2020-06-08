# Simple Firestore App
This is a simple app that shows paging of data from a Google Firestore database.

This project provides both the source code to the application, and a tool to help load "vehicle" data into your Firestore database.

Feedback welcomed and encouraged!

## Getting Started

### Download the project and configure
1. `git clone https://.../simple-fs-app.git`
1. `cd simple-fs-app`
1. `npm install`
1. Edit `src/firestoreConfig.js` and add your Firebase project settings (see comments in that file)

### Load "vehicle" data to your Firestore 
1. Edit the file `tools/json-to-firestore/json-to-firestore.js`
1. Follow the instructions in the comments directing you to load 75, or 1000, vehicles to your Firestore database

### Start the app
1. `npm start`

You should now be able to view and query the Vehicles data.

## Optional component
If you'd like to experiment with the `.get()` call made by redux-firestore for fetching data, consider using the `react-firestore-query-lab`
component:
1. `npm install react-firestore-query-lab`
1. Edit `src/App.jsx` and uncomment the two lines: `import ... "react-firestore-query-lab"` and `<ReactFirestoreQueryLab />`

The "query lab" should show up when your browser refreshes.  If not, stop your console and re-run `npm start`