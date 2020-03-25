import firebase from "firebase";
import "firebase/firestore";

// firebase init goes here
const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY || 'api-key-not-set',
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || 'env-not-set',
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL || 'env-not-set',
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || 'env-not-set',
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || 'env-not-set',
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || 'env-not-set',
    appId: process.env.VUE_APP_FIREBASE_APP_ID || 'env-not-set',
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || 'env-not-set'
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