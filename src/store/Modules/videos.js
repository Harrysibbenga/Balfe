const fb = require("../../firebaseConfig")

const videos = {
    namespaced: true,
    state: {
        allVideos: [],
        video: null,
        videoUrl: null,
        request: null,
        confirmation: null
    },
    mutations: {
        setAllVideos(state, val) {
            if (val) {
                state.allVideos = val
            } else {
                state.allVideos = []
            }
        },
        setVideo(state, val) {
            if (val) {
                state.video = val
            } else {
                state.video = []
            }
        },
        setVideoUrl(state, val) {
            if (val) {
                state.videoUrl = val
            } else {
                state.videoUrl = null;
            }
        },
        setRequest(state, val) {
            if (val) {
                state.request = val
            } else {
                state.request = false;
            }
        },
        confirmation(state, val) {
            if (val) {
                state.confirmation = val
            } else {
                state.confirmation = false;
            }
        }
    },
    actions: {
        setAllVideos({
            commit
        }) {
            fb.videosCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let videos = [];

                querySnapshot.forEach(doc => {
                    let video = doc.data();
                    video.id = doc.id;
                    videos.push(video);
                });
                commit("setAllVideos", videos);
            });
        },
        setVideo({
            commit
        }, url) {
            fb.videosCollection
                .where('url', "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let video = doc.data()
                        video.id = doc.id
                        commit("setVideo", video);
                    })
                })
        },
        uploadVideo({
            commit
        }, file) {
            commit('setRequest', true)
            let storageRef = fb.storage.ref("videos/" + file.name);
            let uploadTask = storageRef.put(file);
            uploadTask.on(
                "state_changed",
                () => {
                    // snapshot
                },
                () => {
                    // Handle unsuccessful uploads
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        fb.videosCollection
                            .add({
                                name: file.name,
                                createdOn: new Date(),
                                url: downloadURL
                            })
                            .then(() => {
                                commit('setVideoUrl', downloadURL)
                                commit("setRequest", false)
                                commit("confirmation", true)
                                setTimeout(() => {
                                    commit("confirmation", false)
                                }, 5000)
                            })
                            .catch(err => {
                                alert(err.message)
                            });
                    })
                }
            )
        }
    },
    getters: {
        getAllVideos(state) {
            return state.allVideos
        },
        getVideo(state) {
            return state.video
        },
        getVideoUrl(state) {
            return state.videoUrl
        },
        getRequest(state) {
            return state.request
        },
        confirmation(state) {
            return state.confirmation
        }
    }
}

export default videos;