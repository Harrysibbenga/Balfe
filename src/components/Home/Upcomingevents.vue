<template>
  <div>
    <h2 class="pl-3 pb-5 font-weight-bold">Upcoming Events</h2>
    <div id="calender-sec" class="py-5">
      <div class="container-fluid">
        <div class="row" v-if="calenderRounds != null">
          <div
            class="col-6 col-sm-4 col-md-3 col-lg-2 pb-5"
            v-for="(round,index) in calenderRounds"
            :key="index"
          >
            <img :src="round.image" class="img-fluid" />
            <div class="mask" v-if="round.ongoing == false"></div>
            <hr class="balfe-line" />
            <h4>{{round.trackName}}</h4>
            <p>Date: {{round.date | formatDate}}</p>
            <a class="text-primary position-absolute" @click="info(round.trackId, round)">More info</a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="container pt-4">
          <div id="circuit-info" class="col-12">
            <div class="row" v-if="track != {}">
              <div class="col-4">
                <h3 class="circuit-name font-weight-bold text-center">{{ track.name }}</h3>
                <hr class="balfe-line" />
                <p>
                  Date:
                  <span class="race-date">{{ track.date | formatDate }}</span>
                </p>
                <p>
                  Coners:
                  <span class="corners">{{ track.corners }}</span>
                </p>
                <p>
                  Circuit length:
                  <span class="circuit-length">{{ track.length }} miles</span>
                </p>
              </div>
              <div class="col-4">
                <h3 class="font-weight-bold text-center">Last Year Result</h3>
                <hr class="balfe-line" />
                <p>
                  GT3 race one result:
                  <span class="gt3-race-result">{{ track.gt3_one }}</span>
                </p>
                <p>
                  GT4 race one result (Pro-Am):
                  <span class="gt4-race-result">{{ track.gt4_one }}</span>
                </p>
                <p>
                  GT3 race two result:
                  <span class="gt3-race-2-result">{{ track.gt3_two }}</span>
                </p>
                <p>
                  GT4 race two result (Pro-Am):
                  <span class="gt4-race-2-result">{{ track.gt4_two }}</span>
                </p>
              </div>
              <div id="fixtures" class="col-4">
                <h3 class="font-weight-bold text-center">Current Result</h3>
                <hr class="balfe-line" />
                <p>
                  Free practice one:
                  <span class="fp1">{{ track.fp_one }}</span>
                </p>
                <p>
                  Free practice two:
                  <span class="fp2">{{ track.fp_two }}</span>
                </p>
                <p>
                  Qualifying:
                  <span class="qualifying">{{ track.qualifying }}</span>
                </p>
                <p>
                  Race one:
                  <span class="race-1">{{ track.race_one }}</span>
                </p>
                <p>
                  Race two:
                  <span class="race-2">{{ track.race_two }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../firebaseConfig");

export default {
  data() {
    return {
      trackInfo: false,
      track: {},
      currentTrack: {}
    };
  },
  computed: {
    calenderRounds() {
      return this.$store.getters["calender/getAllRounds"];
    }
  },
  methods: {
    activeTrack() {
      let activeRounds = [];
      this.trackInfo = true;
      for (let i = 0; i < this.calenderRounds.length; i++) {
        if (this.calenderRounds[i].ongoing == true) {
          activeRounds.push(this.calenderRounds[i]);
        }
      }
      fb.tracksCollection
        .doc(activeRounds[0].trackId)
        .get()
        .then(doc => {
          let track = doc.data();
          this.track = track;
          this.track.date = activeRounds[0].date;
        });
    },
    info(id, round) {
      this.trackInfo = true;
      fb.tracksCollection
        .doc(id)
        .get()
        .then(doc => {
          let track = doc.data();
          track.date = round.date;
          this.track = track;
        });
    }
  },
  filters: {
    formatCreation(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format("MMMM Do YYYY");
    }
  },
  created() {
    this.$store.dispatch("calender/setAllRounds");
    setTimeout(() => {
      this.activeTrack();
    }, 1000);
  }
};
</script>