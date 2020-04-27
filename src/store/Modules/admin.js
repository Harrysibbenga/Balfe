const fb = require("../../firebaseConfig")

const admin = {
    namespaced: true,
    state: {
        currentUser: null,
        userProfile: {}
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val;
        },
        setUserProfile(state, val) {
            state.userProfile = val;
        }
    },
    actions: {
        fetchUser({
            commit,
            state
        }) {
            fb.usersCollection
                .doc(state.currentUser.uid)
                .get()
                .then(res => {
                    commit("setUserProfile", res.data());
                })
                .catch(err => {
                    console.log(err);
                });
        },
        clearData({
            commit
        }) {
            commit("setCurrentUser", null);
            commit("setUserProfile", null);
        },
        updateProfile({
            state
        }, payload) {
            let name = payload.name;
            let title = payload.title;
            fb.usersCollection
                .doc(state.currentUser.uid)
                .update({
                    name: name,
                    title: title
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    getters: {
        currentUser(state) {
            return state.currentUser
        },
        getUserProfile(state) {
            return state.userProfile
        }
    }
}

export default admin;