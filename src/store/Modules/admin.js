const admin = {
    state: {
        currentUser: null,
    },
    mutations: {
        setCurrentUser(state, val) {
            if (val) {
                state.currentUser = val;
            } else {
                state.currentUser = null
            }
        }
    },
    actions: {
        fetchUser({
            commit
        }, user) {
            if (user) {
                commit("setCurrentUser", user);
            } else {
                commit("setCurrentUser", null);
            }
        },
        clearData({
            commit
        }) {
            commit("setCurrentUser", null);
        },
    },
    getters: {
        currentUser(state) {
            return state.currentUser
        }
    }
}

export default admin;