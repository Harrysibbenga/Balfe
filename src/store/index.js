import Vue from "vue";
import Vuex from "vuex";
const fb = require("../firebaseConfig");

Vue.use(Vuex);

// handle page reload
fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit("setCurrentUser", user);
    } else {
        store.commit("setCurrentUser", null);
    }
});

fb.postsCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let postsArray = [];

        querySnapshot.forEach(doc => {
            let post = doc.data();
            post.id = doc.id
            postsArray.push(post);
        });
        store.commit("setPosts", postsArray);
    });

fb.imageUrlCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let imagesOptions = [],
            images = []

        querySnapshot.forEach(doc => {
            let image = doc.data()
            image.id = doc.id
            let imageOption = {
                value: doc.id,
                text: image.name
            }
            images.push(image)
            imagesOptions.push(imageOption)
        });
        store.commit("setOptions", imagesOptions);
        store.commit("setImages", images);
    });

fb.logosCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let logos = [],
            logosOptions = []

        querySnapshot.forEach(doc => {
            let logo = doc.data()
            logo.id = doc.id
            let logoOption = {
                value: doc.id,
                text: logo.name
            }
            logos.push(logo)
            logosOptions.push(logoOption)
        });
        store.commit("setLogos", logos);
        store.commit("setPartnerOptions", logosOptions);
    });

fb.partnersCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let partnerArray = [];

        querySnapshot.forEach(doc => {
            let partner = doc.data();
            partner.id = doc.id
            partnerArray.push(partner);
        });
        store.commit("setPartnerPosts", partnerArray);
    });

fb.driversCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let driverArray = [];

        querySnapshot.forEach(doc => {
            let driver = doc.data();
            driver.id = doc.id
            driverArray.push(driver);
        });
        store.commit("setDrivers", driverArray);
    });

fb.videosCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let videosOptions = [],
            videos = []

        querySnapshot.forEach(doc => {
            let video = doc.data()
            video.id = doc.id
            let videoOption = {
                value: doc.id,
                text: video.name
            }
            videos.push(video)
            videosOptions.push(videoOption)
        });
        store.commit("setVideoOptions", videosOptions);
        store.commit("setVideos", videos);
    });

fb.tracksCollection
    .orderBy("name")
    .onSnapshot(querySnapshot => {
        let trackArray = [],
            trackOptions = []

        querySnapshot.forEach(doc => {
            let track = doc.data();
            track.id = doc.id
            let trackOption = {
                value: doc.id,
                text: track.name
            }
            trackArray.push(track);
            trackOptions.push(trackOption)
        });

        store.commit("setTracks", trackArray);
        store.commit("setTrackOptions", trackOptions);
    });

fb.galleryCollection
    .orderBy("createdOn", "desc")
    .onSnapshot(querySnapshot => {
        let galleryArray = [];

        querySnapshot.forEach(doc => {
            let content = doc.data();
            content.id = doc.id
            galleryArray.push(content);
        });
        store.commit("setGallery", galleryArray);
    });

fb.calenderRounds
    .orderBy("date")
    .onSnapshot(querySnapshot => {
        let calenderArray = []
        querySnapshot.forEach(doc => {
            let round = doc.data()
            round.id = doc.id
            fb.tracksCollection.doc(round.trackId).get().then(doc => {
                round.track = doc.data()
                calenderArray.push(round)
            })
        });
        store.commit("setCalender", calenderArray)
    });
export const store = new Vuex.Store({
    state: {
        currentUser: null,
        imageUpload: null,
        posts: [],
        partners: [],
        images: [],
        logos: [],
        drivers: [],
        videos: [],
        tracks: [],
        options: [],
        calenderRounds: [],
        partnerOptions: [],
        trackOptions: [],
        videoOptions: [],
        galleryContent: [],
        post: null
    },
    actions: {
        clearData({
            commit
        }) {
            commit("setCurrentUser", null);
            commit("setOptions", []);
            commit("setPartnerOptions", []);
            commit("setTrackOptions", []);
            commit("setVideoOptions", []);
        },
        getPost({
            commit,
        }, id) {
            console.log(id)
            fb.postsCollection.doc(id)
                .get()
                .then(doc => {
                    let post = doc.data()
                    commit("setPost", post)
                })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val;
        },
        setPosts(state, val) {
            if (val) {
                state.posts = val;
            } else {
                state.posts = [];
            }
        },
        setPartnerPosts(state, val) {
            if (val) {
                state.partners = val;
            } else {
                state.partners = [];
            }
        },
        setOptions(state, val) {
            if (val) {
                state.options = val
            } else {
                state.options = []
            }
        },
        setPartnerOptions(state, val) {
            if (val) {
                state.partnerOptions = val
            } else {
                state.partnerOptions = []
            }
        },
        setDrivers(state, val) {
            if (val) {
                state.drivers = val;
            } else {
                state.drivers = [];
            }
        },
        setImages(state, val) {
            if (val) {
                state.images = val;
            } else {
                state.images = [];
            }
        },
        setLogos(state, val) {
            if (val) {
                state.logos = val;
            } else {
                state.logos = [];
            }
        },
        setVideos(state, val) {
            if (val) {
                state.videos = val;
            } else {
                state.videos = [];
            }
        },
        setVideoOptions(state, val) {
            if (val) {
                state.videoOptions = val;
            } else {
                state.videoOptions = [];
            }
        },
        setTrackOptions(state, val) {
            if (val) {
                state.trackOptions = val;
            } else {
                state.trackOptions = [];
            }
        },
        setTracks(state, val) {
            if (val) {
                state.tracks = val;
            } else {
                state.tracks = [];
            }
        },
        setGallery(state, val) {
            if (val) {
                state.galleryContent = val
            } else {
                state.galleryContent = []
            }
        },
        setCalender(state, val) {
            if (val) {
                state.calenderRounds = val
            } else {
                state.calenderRounds = []
            }
        },
        setPost(state, val) {
            if (val) {
                state.post = val
            } else {
                state.post = null
            }
        },
        clearPost(state) {
            state.post = null
        }
    }
});

export default store;