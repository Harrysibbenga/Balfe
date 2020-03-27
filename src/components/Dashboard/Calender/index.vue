<template>
  <div>
    <div class="row">
      <div class="col-6">
        <h2>Add round</h2>
        <b-form @submit.prevent>
          <b-form-select
            v-model="selectTrack.selected"
            :options="trackOptions"
            size="sm"
            class="mt-3"
            @change="selectOption"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Select the track --</b-form-select-option>
            </template>
          </b-form-select>

          <b-form-group id="number" label="Round" label-for="number" class="text-left">
            <b-input id="number" v-model.trim="track.number" type="text"></b-input>
          </b-form-group>

          <b-form-group id="date" label="Date" label-for="date" class="text-left">
            <datepicker id="date" v-model="track.date" type="text"></datepicker>
          </b-form-group>

          <b-button
            type="submit"
            :disabled="selectTrack.selected == null || track.date == ''"
            variant="primary"
            @click="createRound"
          >Add Round</b-button>
        </b-form>
      </div>
      <div class="col-6">
        <h2>Manage tracks</h2>
        <b-form-select
          v-model="viewTrack.selected"
          :options="trackOptions"
          size="sm"
          class="mt-3"
          @change="viewOption"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Select the track --</b-form-select-option>
          </template>
        </b-form-select>

        <table class="table table-striped table-hover text-left" v-if="trackView">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Coners</th>
              <th scope="col">Length (m)</th>
              <th scope="col">Updated</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ track.name }}</td>
              <td>{{ track.corners }}</td>
              <td>{{ track.length }} m</td>
              <td>{{ track.createdOn | formatCreation }}</td>
              <td>
                <div class="d-inline px-1 text-dark" @click="editTrack(track)">Edit</div>
                <div class="d-inline px-1 text-primary" @click="deleteTrack(track)">Delete</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>Select a track to view or edit</div>
        <div v-if="confirmation == 'track'">Track has been edited</div>
      </div>
    </div>

    <b-modal v-model="editTrackDialog" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <b-form-group id="name" label="Name" label-for="name" class="text-left">
          <b-input id="name" v-model="editTrackForm.name" type="text"></b-input>
        </b-form-group>

        <b-form-group id="corners" label="Corners" label-for="corners" class="text-left">
          <b-input id="corners" v-model.trim="editTrackForm.corners" type="number"></b-input>
        </b-form-group>

        <b-form-group id="length" label="Length (m)" label-for="length" class="text-left">
          <b-input id="length" v-model.trim="editTrackForm.length" type="text"></b-input>
        </b-form-group>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editTrackOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editTrackOnCancel">Cancel</b-button>
      </div>
    </b-modal>

    <hr class="balfe-line" />
    <div v-if="confirmation == 'rounds'">Round edited</div>
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
              <div class="d-inline px-1 text-dark" @click="editRound(round)">Edit</div>
              <div class="d-inline px-1 text-primary" @click="deleteRound(round)">Delete</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no fixtures yet .......... Add some!</div>
    <b-modal v-model="editDialog" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <b-form-select
          v-model="selectTrack.selected"
          :options="trackOptions"
          size="sm"
          class="mt-3"
          @change="selectOption"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Select the track --</b-form-select-option>
          </template>
        </b-form-select>

        <b-form-group id="date" label="Date" label-for="date" class="text-left">
          <span>Current date: {{ currentRound.date }}</span>
          <datepicker id="date" v-model="editForm.date" type="date"></datepicker>
        </b-form-group>

        <b-form-group id="number" label="Rounds" label-for="number" class="text-left">
          <b-input id="number" v-model.trim="editForm.number" type="text"></b-input>
        </b-form-group>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editOnCancel">Cancel</b-button>
      </div>
    </b-modal>
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
        trackInfo: null,
        date: "",
        number: ""
      },
      roundToEdit: null,
      trackToEdit: null,
      editDialog: false,
      editTrackDialog: false,
      selectTrack: {
        selected: null,
        track: null
      },
      viewTrack: {
        selected: null,
        track: null
      },
      currentRound: {
        date: null
      },
      editForm: {
        trackInfo: null,
        date: "",
        number: ""
      },
      editTrackForm: {
        name: null,
        corners: "",
        length: "",
        image: null
      },
      trackView: null,
      confirmation: null,
      performingRequest: false
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
          this.track.trackInfo = null;
          this.track.date = "";
          this.track.number = "";
          this.selectTrack.selected = null;
        })
        .catch(error => alert(error.message));
    },
    selectOption(id) {
      fb.tracksCollection
        .doc(id)
        .get()
        .then(doc => {
          this.track.trackInfo = doc.data();
          this.track.trackInfo.id = doc.id;
        })
        .catch(error => alert(error.message));
    },
    editRound(round) {
      this.roundToEdit = round;
      let date = round.date;
      this.editDialog = true;
      this.editForm.trackInfo = round.trackInfo;
      this.currentRound.date = this.formatDate(date);
      this.editForm.number = round.number;
      this.selectTrack.selected = round.trackInfo.id;
    },
    editOnConfirm() {
      this.performingRequest = true;

      fb.calenderRounds
        .doc(this.roundToEdit.id)
        .update({
          trackInfo: this.editForm.trackInfo,
          date: this.editForm.date,
          number: this.editForm.number,
          createdOn: new Date()
        })
        .then(() => {
          this.editForm.trackInfo = null;
          this.editForm.date = "";
          this.editForm.number = "";
          this.selectTrack.selected = null;
          this.performingRequest = false;
          this.editDialog = false;
          this.editConf("rounds");
        })
        .catch(err => {
          this.performingRequest = false;
          alert(err.message);
        });
    },
    editOnCancel() {
      this.roundToEdit = null;
      this.editDialog = false;
      this.editForm.trackInfo = null;
      this.editForm.date = "";
      this.editForm.number = "";
      this.selectTrack.selected = null;
    },
    deleteRound(round) {
      fb.calenderRounds.doc(round.id).delete();
    },
    viewOption(id) {
      fb.tracksCollection
        .doc(id)
        .get()
        .then(doc => {
          this.track = doc.data();
          this.track.id = doc.id;
          this.trackView = true;
        })
        .catch(error => alert(error.message));
    },
    editTrack(track) {
      this.trackToEdit = track;
      this.editTrackDialog = true;
      this.editTrackForm.name = track.name;
      this.editTrackForm.corners = track.corners;
      this.editTrackForm.length = track.length;
      this.viewTrack.selected = track.id;
    },
    editTrackOnConfirm() {
      this.performingRequest = true;

      fb.tracksCollection
        .doc(this.trackToEdit.id)
        .update({
          name: this.editTrackForm.name,
          corners: this.editTrackForm.corners,
          length: this.editTrackForm.length,
          createdOn: new Date(),
          image: this.editTrackForm.image
        })
        .then(() => {
          this.editTrackForm.name = "";
          this.editTrackForm.corners = "";
          this.editTrackForm.length = "";
          this.editTrackDialog = false;
          this.performingRequest = false;
          this.viewTrack.selected = null;
          this.trackToEdit = null;
          this.trackView = null;
          this.editConf("track");
        })
        .catch(err => {
          this.performingRequest = false;
          alert(err.message);
        });
    },
    editTrackOnCancel() {
      this.trackToEdit = null;
      this.editTrackForm.name = "";
      this.editTrackForm.corners = "";
      this.editTrackForm.length = "";
      this.editTrackDialog = false;
    },
    deleteTrack(track) {
      fb.tracksCollection.doc(track.id).delete();
    },
    editConf(type) {
      this.confirmation = type;
      setTimeout(() => {
        this.confirmation = false;
      }, 3000);
    },
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format("MMMM Do YYYY");
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
