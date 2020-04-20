<template>
  <div>
    <h2 class="pl-3 pb-5 font-weight-bold">Upcoming Events</h2>
    <div id="calender-sec" class="py-5">
      <div class="container-fluid">
        <div class="row">
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
            <a class="text-primary position-absolute" @click="information(round.trackId)">More info</a>
          </div>
        </div>
      </div>
    </div>
    <div class="container pb-5">
      <div class="row">
        <div id="circuit-info" class="col-12">
          <div class="row">
            <div class="col-4">
              <h3 class="circuit-name font-weight-bold text-center">Oulton Park</h3>
              <hr class="balfe-line" />
              <p>
                Date:
                <span class="race-date">11/13 April, 2020</span>
              </p>
              <p>
                Coners:
                <span class="corners">12</span>
              </p>
              <p>
                Circuit length:
                <span class="circuit-length">2.23 miles</span>
              </p>
            </div>
            <div class="col-4">
              <h3 class="font-weight-bold text-center">2019 Results</h3>
              <hr class="balfe-line" />
              <p>
                GT3 race one result:
                <span class="gt3-race-result">DNS</span>
              </p>
              <p>
                GT4 race one result (Pro-Am):
                <span class="gt4-race-result">Third</span>
              </p>
              <p>
                GT3 race two result:
                <span class="gt3-race-2-result">DNS</span>
              </p>
              <p>
                GT4 race two result (Pro-Am):
                <span class="gt4-race-2-result">First</span>
              </p>
            </div>
            <div id="fixtures" class="col-4">
              <h3 class="font-weight-bold text-center">2020 Timetable</h3>
              <hr class="balfe-line" />
              <p>
                Free practice one:
                <span class="fp1">TBA</span>
              </p>
              <p>
                Free practice two:
                <span class="fp2">TBA</span>
              </p>
              <p>
                Qualifying:
                <span class="qualifying">TBA</span>
              </p>
              <p>
                Race one:
                <span class="race-1">TBA</span>
              </p>
              <p>
                Race two:
                <span class="race-2">TBA</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {};
  },
  computed: {
    calenderRounds() {
      return this.$store.getters["calender/getAllRounds"];
    }
  },
  methods: {},
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
    this.getCalenderRounds();
  }
};
</script>