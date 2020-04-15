const fb = require("../../firebaseConfig");

const images = {
    namespaced: true,
    state: {
        images: [],
        imageUrl: null,
        imageId: null,
        image: null,
        logos: [],
        logoUrl: null,
        logoId: null,
        logo: null,
        request: false,
        videos: [],
        options: [],
        confirmation: false
    },
    actions: {
        getImages({
            commit
        }) {
            fb.imageUrlCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let images = [];

                querySnapshot.forEach(doc => {
                    let image = doc.data();
                    image.id = doc.id;
                    images.push(image);
                });
                commit("getImages", images);
            });
        },
        getImage({
            commit
        }, url) {
            fb.imageUrlCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let image = doc.data();
                        image.id = doc.id;
                        commit("getImage", image);
                    });

                })
        },
        getLogos({
            commit
        }) {
            fb.logosCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let logos = [];

                querySnapshot.forEach(doc => {
                    let logo = doc.data();
                    logo.id = doc.id;
                    logos.push(logo);
                });
                commit("getLogos", logos);
            });
        },
        getLogo({
            commit
        }, url) {
            fb.logosCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let logo = doc.data();
                        logo.id = doc.id;
                        commit("getLogo", logo);
                    });

                })
        },
        getOptions({
            commit
        }) {
            fb.imageUrlCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let imagesOptions = []

                querySnapshot.forEach(doc => {
                    let image = doc.data();
                    let imageOption = {
                        value: doc.id,
                        text: image.name
                    };
                    imagesOptions.push(imageOption);
                });
                commit("getOptions", imagesOptions);
            });
        },
        uploadImage({
            commit
        }, file) {
            commit("setRequest", true)
            let storageRef = fb.storage.ref("images/" + file.name);
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
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        fb.imageUrlCollection
                            .add({
                                name: file.name,
                                createdOn: new Date(),
                                url: downloadURL
                            })
                            .then(() => {
                                commit('setImageUrl', downloadURL)
                                commit("setRequest", false)
                                commit("confirmation", true)
                                setTimeout(() => {
                                    commit("confirmation", false)
                                }, 5000)
                            })
                            .catch(err => {
                                alert(err.message)
                            });
                    });
                }
            );
        },
        uploadLogo({
            commit
        }, file) {
            commit("setRequest", true)
            let storageRef = fb.storage.ref("logos/" + file.name);
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
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        fb.logosCollection
                            .add({
                                name: file.name,
                                createdOn: new Date(),
                                url: downloadURL
                            })
                            .then(() => {
                                commit('setLogoUrl', downloadURL)
                                commit("setRequest", false)
                                commit("confirmation", true)
                                setTimeout(() => {
                                    commit("confirmation", false)
                                }, 5000)
                            })
                            .catch(err => {
                                alert(err.message)
                            });
                    });
                }
            );
        }
    },
    mutations: {
        getOptions(state, val) {
            if (val) {
                state.options = val;
            } else {
                state.options = [];
            }
        },
        getImages(state, val) {
            if (val) {
                state.images = val;
            } else {
                state.images = [];
            }
        },
        getImage(state, val) {
            if (val) {
                state.image = val;
            } else {
                state.image = {};
            }
        },
        getLogos(state, val) {
            if (val) {
                state.logos = val;
            } else {
                state.logos = [];
            }
        },
        getLogo(state, val) {
            if (val) {
                state.logo = val;
            } else {
                state.logo = {};
            }
        },
        setImageUrl(state, val) {
            if (val) {
                state.imageUrl = val
            } else {
                state.imageUrl = null
            }
        },
        setLogoUrl(state, val) {
            if (val) {
                state.logoUrl = val
            } else {
                state.logoUrl = null
            }
        },
        setImageId(state, val) {
            if (val) {
                state.imageId = val
            } else {
                state.imageId = null
            }
        },
        setLogoId(state, val) {
            if (val) {
                state.logoId = val
            } else {
                state.logoId = null
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
    getters: {
        getOptions(state) {
            return state.options
        },
        getImages(state) {
            return state.images
        },
        getImage(state) {
            return state.image
        },
        getLogos(state) {
            return state.logos
        },
        getLogo(state) {
            return state.logo
        },
        getRequest(state) {
            return state.request
        },
        getImageUrl(state) {
            return state.imageUrl
        },
        getImageId(state) {
            return state.imageId
        },
        getLogoUrl(state) {
            return state.logoUrl
        },
        getLogoId(state) {
            return state.logoId
        },
        confirmation(state) {
            return state.confirmation
        }
    }
}

export default images;