const fb = require("../../firebaseConfig");

const posts = {
    namespaced: true,
    state: {
        posts: [],
        post: null
    },
    mutations: {
        setPosts(state, val) {
            if (val) {
                state.posts = val;
            } else {
                state.posts = [];
            }
        },
        setPost(state, val) {
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
                    commit("setPost", post);
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
                commit("setPosts", postsArray);
            });
        }
    },
    getters: {
        getPost(state) {
            return state.post
        },
        getPosts(state) {
            return state.posts
        }
    }
}

export default posts;