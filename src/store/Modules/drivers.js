const fb = require("../../firebaseConfig");

const drivers = {
    namespaced: true,
    state: {
        allDrivers: [],
        driver: null
    },
    mutations: {
        setDrivers(state, val) {
            if (val) {
                state.allDrivers = val
            } else {
                state.allDrivers = []
            }
        },
        setDriver(state, val) {
            if (val) {
                state.driver = val
            } else {
                state.driver = null
            }
        }
    },
    actions: {
        setDrivers({
            commit
        }) {
            fb.driversCollection.orderBy("firstName").onSnapshot(querySnapshot => {
                let driverArray = [];

                querySnapshot.forEach(doc => {
                    let driver = doc.data();
                    driver.id = doc.id;
                    driverArray.push(driver);
                });
                commit("setDrivers", driverArray);
            });
        },
        setDriver({
            commit
        }, id) {
            fb.driversCollection
                .doc(id)
                .get()
                .then(doc => {
                    let driver = doc.data()
                    driver.id = doc.id
                    commit("setDriver", driver)
                })
        }
    },
    getters: {
        getDriver(state) {
            return state.driver
        },
        getDrivers(state) {
            return state.allDrivers
        }
    }
}

export default drivers;