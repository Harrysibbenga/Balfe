const fb = require("../../firebaseConfig");

const posts = {
    namespaced: true,
    state: {
        allPosts: [],
        post: null
    },
    mutations: {
        getPosts(state, val) {
            if (val) {
                state.allPosts = val
            } else {
                state.allPosts = []
            }
        },
        getPost(state, val) {
            if (val) {
                state.post = val;
            } else {
                state.post = null;
            }
        },
        clearPost(state) {
            state.post = null;
        }
    },
    actions: {
        getPost({
            commit
        }, id) {
            fb.postsCollection
                .doc(id)
                .get()
                .then(doc => {
                    let post = doc.data();
                    commit("getPost", post);
                });
        },
        getPosts({
            commit
        }) {
            fb.postsCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
                let postsArray = [];

                querySnapshot.forEach(doc => {
                    let post = doc.data();
                    post.id = doc.id;
                    postsArray.push(post);
                });
                commit("getPosts", postsArray)
            });
        }
    },
    getters: {
        getPost(state) {
            return state.post
        },
        getPosts(state) {
            return state.allPosts
        }
    }
}

export default posts;