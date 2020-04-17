const fb = require("../../firebaseConfig");

const history = {
    namespaced: true,
    state: {
        allHistory: [],
        history: null
    },
    mutations: {
        setAllHistory(state, val) {
            if (val) {
                state.allHistory = val
            } else {
                state.allHistory = []
            }
        },
        setHistory(state, val) {
            if (val) {
                state.history = val;
            } else {
                state.history = null;
            }
        },
        clearHistory(state) {
            state.history = null;
        }
    },
    actions: {
        setHistory({
            commit
        }, id) {
            fb.historicCollection
                .doc(id)
                .get()
                .then(doc => {
                    let history = doc.data();
                    commit("setHistory", history);
                });
        },
        setAllHistory({
            commit
        }) {
            fb.historicCollection.orderBy("date", "desc").onSnapshot(querySnapshot => {
                let historyArray = [];

                querySnapshot.forEach(doc => {
                    let History = doc.data();
                    History.id = doc.id;
                    historyArray.push(History);
                });
                commit("setAllHistory", historyArray)
            });
        }
    },
    getters: {
        getHistory(state) {
            return state.history
        },
        getAllHistory(state) {
            return state.allHistory
        }
    }
}

export default history;