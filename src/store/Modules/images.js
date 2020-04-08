const fb = require("../../firebaseConfig");

const images = {
    namespaced: true,
    state: {
        images: [],
        imageUrl: null,
        imageId: null,
        image:null,
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
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        // this.selectImage.selectedUrl = downloadURL;
                        // let galleryImage = {
                        //     name: file.name,
                        //     url: downloadURL
                        // };
                        // this.galleryImages.push(galleryImage);
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
                state.image = [];
            }
        },
        setImageUrl(state, val) {
            if (val) {
                state.imageUrl = val
            } else {
                state.imageUrl = null
            }
        },
        setImageId(state, val) {
            if (val) {
                state.imageId = val
            } else {
                state.imageId = null
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
        getRequest(state) {
            return state.request
        },
        getImageUrl(state) {
            return state.imageUrl
        },
        getImageId(state) {
            return state.imageId
        },
        confirmation(state) {
            return state.confirmation
        }
    }
}

export default images;