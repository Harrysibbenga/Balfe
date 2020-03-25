import firebase from "firebase";
import "firebase/firestore";
const {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    measurementId,
    appId,
    messagingSenderId
} = require('./config');
// firebase init goes here
const config = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
};

// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const currentUser = auth.currentUser;
const fbApiKey = config.apiKey
const fbDbURL = config.databaseURL

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
};
db.settings(settings);

// firebase collections
const historicCollection = db.collection("historic");
const postsCollection = db.collection("posts");
const mediaCollection = db.collection("media");
const usersCollection = db.collection("users");
const driversCollection = db.collection("drivers");
const calenderRounds = db.collection("calender");
const imageUrlCollection = db.collection('images');
const partnersCollection = db.collection('partners');
const logosCollection = db.collection('logos');
const videosCollection = db.collection('videos');
const galleryCollection = db.collection('gallery');
const tracksCollection = db.collection("tracks");

export default {
    db,
    auth,
    storage,
    currentUser,
    fbApiKey,
    fbDbURL,
    usersCollection,
    postsCollection,
    historicCollection,
    mediaCollection,
    driversCollection,
    calenderRounds,
    imageUrlCollection,
    logosCollection,
    partnersCollection,
    videosCollection,
    galleryCollection,
    tracksCollection
};