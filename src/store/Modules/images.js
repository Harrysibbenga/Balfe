const fb = require("../../firebaseConfig");

const images = {
    namespaced: true,
    state: {
        images: [],
        imageUrl: null,
        image: null,
        logos: [],
        logoUrl: null,
        logo: null,
        driverImages: [],
        driverImageUrl: null,
        driverImage: null,
        trackImages: [],
        trackImageUrl: null,
        trackImage: null,
        request: false,
        confirmation: false
    },
    actions: {
        setImages({
            commit
        }) {
            fb.imageUrlCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let images = [];

                querySnapshot.forEach(doc => {
                    let image = doc.data();
                    image.id = doc.id;
                    images.push(image);
                });
                commit("setImages", images);
            });
        },
        setImage({
            commit
        }, url) {
            fb.imageUrlCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let image = doc.data();
                        image.id = doc.id;
                        commit("setImage", image);
                    });

                })
        },
        setLogos({
            commit
        }) {
            fb.logosCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let logos = [];

                querySnapshot.forEach(doc => {
                    let logo = doc.data();
                    logo.id = doc.id;
                    logos.push(logo);
                });
                commit("setLogos", logos);
            });
        },
        setLogo({
            commit
        }, url) {
            fb.logosCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let logo = doc.data();
                        logo.id = doc.id;
                        commit("setLogo", logo);
                    });

                })
        },
        setDriverImages({
            commit
        }) {
            fb.driversImagesCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let images = [];

                querySnapshot.forEach(doc => {
                    let image = doc.data();
                    image.id = doc.id;
                    images.push(image);
                });
                commit("setDriverImages", images);
            });
        },
        setDriverImage({
            commit
        }, url) {
            fb.driversImagesCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let image = doc.data();
                        image.id = doc.id;
                        commit("setDriverImage", image);
                    });

                })
        },
        setTrackImages({
            commit
        }) {
            fb.tracksImagesCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let images = [];

                querySnapshot.forEach(doc => {
                    let image = doc.data();
                    image.id = doc.id;
                    images.push(image);
                });
                commit("setTrackImages", images);
            });
        },
        setTrackImage({
            commit
        }, url) {
            fb.tracksImagesCollection.where("url", "==", url)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        let image = doc.data();
                        image.id = doc.id;
                        commit("setTrackImage", image);
                    });

                })
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
        },
        uploadDriverImage({
            commit
        }, file) {
            commit("setRequest", true)
            let storageRef = fb.storage.ref("drivers/" + file.name);
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
                        fb.driversImagesCollection
                            .add({
                                name: file.name,
                                createdOn: new Date(),
                                url: downloadURL
                            })
                            .then(() => {
                                commit('setDriverUrl', downloadURL)
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
        uploadTrackImage({
            commit
        }, file) {
            commit("setRequest", true)
            let storageRef = fb.storage.ref("tracks/" + file.name);
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
                        fb.tracksImagesCollection
                            .add({
                                name: file.name,
                                createdOn: new Date(),
                                url: downloadURL
                            })
                            .then(() => {
                                commit('setTrackUrl', downloadURL)
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
        setImages(state, val) {
            if (val) {
                state.images = val;
            } else {
                state.images = [];
            }
        },
        setImage(state, val) {
            if (val) {
                state.image = val;
            } else {
                state.image = {};
            }
        },
        setLogos(state, val) {
            if (val) {
                state.logos = val;
            } else {
                state.logos = [];
            }
        },
        setLogo(state, val) {
            if (val) {
                state.logo = val;
            } else {
                state.logo = {};
            }
        },
        setDriverImages(state, val) {
            if (val) {
                state.driverImages = val;
            } else {
                state.driverImages = [];
            }
        },
        setDriverImage(state, val) {
            if (val) {
                state.driverImage = val;
            } else {
                state.driverImage = {};
            }
        },
        setTrackImages(state, val) {
            if (val) {
                state.trackImages = val;
            } else {
                state.trackImages = [];
            }
        },
        setTrackImage(state, val) {
            if (val) {
                state.trackImage = val;
            } else {
                state.trackImage = {};
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
        setDriverUrl(state, val) {
            if (val) {
                state.driverImageUrl = val
            } else {
                state.driverImageUrl = null;
            }
        },
        setTrackUrl(state, val) {
            if (val) {
                state.trackImageUrl = val
            } else {
                state.trackImageUrl = null;
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
        getDriverImages(state) {
            return state.driverImages
        },
        getDriverImage(state) {
            return state.driverImage
        },
        getTrackImages(state) {
            return state.trackImages
        },
        getTrackImage(state) {
            return state.trackImage
        },
        getImageUrl(state) {
            return state.imageUrl
        },
        getLogoUrl(state) {
            return state.logoUrl
        },
        getDriverUrl(state) {
            return state.driverImageUrl
        },
        getTrackUrl(state) {
            return state.trackImageUrl
        },
        getRequest(state) {
            return state.request
        },
        confirmation(state) {
            return state.confirmation
        }
    }
}

export default images;