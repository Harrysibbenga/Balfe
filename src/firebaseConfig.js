import firebase from "firebase";
import "firebase/firestore";

// firebase init goes here
const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
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