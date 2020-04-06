const fb = require("../../firebaseConfig");

fb.imageUrlCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
    let imagesOptions = [],
        images = [];

    querySnapshot.forEach(doc => {
        let image = doc.data();
        image.id = doc.id;
        let imageOption = {
            value: doc.id,
            text: image.name
        };
        images.push(image);
        imagesOptions.push(imageOption);
    });
    images.commit("setOptions", imagesOptions);
    images.commit("setImages", images);
});

const images = {
    state: {
        images: [],
        imageUrl: null,
        request: false,
        videos: [],
        options: [],
    },
    actions: {
        imageUpload({
            commit
        }, file) {
            commit('setRequest', true)
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
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        commit('setRequest', false)
                        commit("setImageUrl", downloadURL)
                    })
                }
            )
        },
    },
    mutations: {
        setOptions(state, val) {
            if (val) {
                state.options = val;
            } else {
                state.options = [];
            }
        },
        setImages(state, val) {
            if (val) {
                state.images = val;
            } else {
                state.images = [];
            }
        },
        setImageUrl(state, val) {
            if (val) {
                state.imageUrl = val
            } else {
                state.imageUrl = ""
            }
        },
        setRequest(state, val) {
            if (val) {
                state.request = val
            } else {
                state.request = false;
            }
        }
    }
}

export default images;