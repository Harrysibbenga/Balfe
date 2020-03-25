<template>
  <div>
    <b-form @submit.prevent>
      <b-form-select
        v-model="selectTrack.selected"
        :options="trackOptions"
        size="sm"
        class="mt-3"
        @change="selectOption"
      >
        <template v-slot:first>
          <b-form-select-option :value="null" disabled
            >-- Select the track --</b-form-select-option
          >
        </template>
      </b-form-select>

      <b-form-group id="date" label="Date" label-for="date" class="text-left">
        <datepicker id="date" v-model="track.date" type="text"></datepicker>
      </b-form-group>

      <b-form-group
        id="number"
        label="Rounds"
        label-for="number"
        class="text-left"
      >
        <b-input id="number" v-model.trim="track.number" type="text"></b-input>
      </b-form-group>

      <b-button
        type="submit"
        :disabled="selectTrack.selected == null || track.date == ''"
        variant="primary"
        @click="createRound"
        >Add Round</b-button
      >
    </b-form>

    <hr class="balfe-line" />
    <div v-if="calenderRounds.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Rounds</th>
            <th scope="col">Date</th>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(round, index) in calenderRounds" :key="index">
            <td scope="row">{{ round.number }}</td>
            <td>{{ round.date | formatDate }}</td>
            <td>{{ round.trackInfo.name }}</td>
            <td>
              <img :src="round.trackInfo.image" class="img-fluid" />
            </td>
            <td>{{ round.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-dark" @click="editRound(round)">
                Edit
              </div>
              <div
                class="d-inline px-1 text-primary"
                @click="deleteRound(round)"
              >
                Delete
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no fixtures yet .......... Add some!</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      track: {
        trackInfo: {},
        date: "",
        number: ""
      },
      selectTrack: {
        selected: null,
        track: {}
      }
    };
  },
  computed: {
    ...mapState(["trackOptions", "calenderRounds"])
  },
  methods: {
    createRound() {
      fb.calenderRounds
        .add({
          number: this.track.number,
          date: this.track.date,
          trackInfo: this.track.trackInfo,
          createdOn: new Date()
        })
        .then(() => {
          this.track.trackInfo = {};
          this.track.date = "";
          this.track.number = "";
        })
        .catch(err => {});
    },
    selectOption(id) {
      fb.tracksCollection
        .doc(id)
        .get()
        .then(doc => {
          this.track.trackInfo = doc.data();
        })
        .catch(err => {
          log(err);
        });
    },
    deleteRound(round) {
      fb.calenderRounds.doc(round.id).delete();
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
  }
};
</script>
