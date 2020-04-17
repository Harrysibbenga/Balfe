const fb = require("../../firebaseConfig");

const partners = {
    namespaced: true,
    state: {
        allPartners: [],
        partner: null
    },
    mutations: {
        setPartners(state, val) {
            if (val) {
                state.allPartners = val;
            } else {
                state.allPartners = [];
            }
        },
        setPartner(state, val) {
            if (val) {
                state.partner = val;
            } else {
                state.partner = null;
            }
        },
        clearPartner(state) {
            state.partner = null;
        }
    },
    actions: {
        setPartner({
            commit
        }, id) {
            fb.partnersCollection
                .doc(id)
                .get()
                .then(doc => {
                    let partner = doc.data()
                    partner.id = doc.id
                    commit("setPartner", partner)
                })
        },
        setPartners({
            commit
        }) {
            fb.partnersCollection.orderBy("name", "desc").onSnapshot(querySnapshot => {
                let partnerArray = [];

                querySnapshot.forEach(doc => {
                    let partner = doc.data();
                    partner.id = doc.id;
                    partnerArray.push(partner);
                });
                commit("setPartners", partnerArray);
            });
        }
    },
    getters: {
        getPartner(state) {
            return state.partner
        },
        getPartners(state) {
            return state.allPartners
        }
    }
}

export default partners;