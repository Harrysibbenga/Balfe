const fb = require("../../firebaseConfig")

const gallery = {
    namespaced: true,
    state: {
        galleryContent: []
    },
    mutations: {
        setGallery(state, val) {
            if (val) {
                state.galleryContent = val
            } else {
                state.galleryContent = []
            }
        }
    },
    actions: {
        setGallery({
            commit
        }) {
            fb.galleryCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let galleryArray = [];

                querySnapshot.forEach(doc => {
                    let content = doc.data();
                    content.id = doc.id;
                    galleryArray.push(content);
                });
                commit("setGallery", galleryArray);
            });
        }
    },
    getters: {
        getGallery(state) {
            return state.galleryContent
        }
    }
}

export default gallery