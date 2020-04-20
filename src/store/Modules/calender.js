const fb = require("../../firebaseConfig")

const calender = {
    namespaced: true,
    state: {
        allRounds: [],
        round: null,
        tracks: [],
        track: null,
        trackOptions: []
    },
    mutations: {
        setAllRounds(state, val) {
            if (val) {
                state.allRounds = val;
            } else {
                state.allRounds = []
            }
        },
        setRound(state, val) {
            if (val) {
                state.round = val;
            } else {
                state.round = null
            }
        },
        setAllTracks(state, val) {
            if (val) {
                state.tracks = val
            } else {
                state.tracks = []
            }
        },
        setTrack(state, val) {
            if (val) {
                state.track = val
            } else {
                state.track = null
            }
        },
        setTrackOptions(state, val) {
            if (val) {
                state.trackOptions = val;
            } else {
                state.trackOptions = [];
            }
        }
    },
    actions: {
        setAllRounds({
            commit
        }) {
            fb.calenderRounds
                .orderBy("date")
                .onSnapshot(querySnapshot => {
                    let roundArray = [],
                        now = new Date()

                    querySnapshot.forEach(doc => {
                        let round = doc.data();
                        round.id = doc.id;
                        roundArray.push(round);
                        if (round.date.toDate() < now) {
                            round.ongoing = false;
                        } else {
                            round.ongoing = true;
                        }
                    });
                    commit("setAllRounds", roundArray);
                });
        },
        setRound({
            commit
        }, id) {
            fb.calenderRounds
                .doc(id)
                .get()
                .then(doc => {
                    let round = doc.data()
                    round.id = doc.id
                    commit("setRound", round)
                })
        },
        setAllTracks({
            commit
        }) {
            fb.tracksCollection
                .orderBy("name")
                .onSnapshot(querySnapshot => {
                    let trackArray = [],
                        trackOptions = [];

                    querySnapshot.forEach(doc => {
                        let track = doc.data();
                        track.id = doc.id;
                        let trackOption = {
                            value: doc.id,
                            text: track.name
                        };
                        trackArray.push(track);
                        trackOptions.push(trackOption);
                    });

                    commit("setAllTracks", trackArray);
                    commit("setTrackOptions", trackOptions);
                });

        },
        setTrack({
            commit
        }, id) {
            fb.tracksCollection
                .doc(id)
                .get()
                .then(doc => {
                    let track = doc.data()
                    track.id = doc.id
                    commit("setTrack", track)
                })
        }
    },
    getters: {
        getAllRounds(state) {
            return state.allRounds
        },
        getRound(state) {
            return state.round
        },
        getAllTracks(state) {
            return state.tracks
        },
        getTrack(state) {
            return state.track
        },
        getTrackOptions(state) {
            return state.trackOptions
        }
    }
}

export default calender