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
            <b-input id="number" v-model.trim="round.number" type="text"></b-input>
          </b-form-group>

          <b-form-group id="date" label="Date" label-for="date" class="text-left">
            <datepicker id="date" v-model="round.date" type="text"></datepicker>
          </b-form-group>

          <b-button
            type="submit"
            :disabled="selectTrack.selected == null || round.date == ''"
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
              <td>{{ viewTrack.track.name }}</td>
              <td>{{ viewTrack.track.corners }}</td>
              <td>{{ viewTrack.track.length }} m</td>
              <td>{{ viewTrack.track.createdOn | formatCreation }}</td>
              <td>
                <div class="d-inline px-1 text-dark" @click="editTrack(viewTrack.track)">Edit</div>
                <div class="d-inline px-1 text-primary" @click="deleteTrack(viewTrack.track)">Delete</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>Select a track to view or edit</div>
        <div class="text-success" v-if="confirm == 'track'">Track has been edited</div>
      </div>
    </div>

    <hr class="balfe-line" />
    <div class="text-success" v-if="confirm == 'rounds'">Round edited</div>
    <div v-if="calender.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Rounds</th>
            <th scope="col">Date</th>
            <th scope="col">Track</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(round, index) in calender" :key="index">
            <td scope="row">{{ round.number }}</td>
            <td>{{ round.date | formatDate }}</td>
            <td>{{ round.trackName }}</td>
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
    <!-- Models -->
    <!-- Edit track  -->
    <b-modal
      v-model="editTrackDialog"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
    >
      <b-form @submit.prevent>
        <transition name="fade">
          <div v-if="request" class="loading">
            <p class="text-dark">Loading...</p>
          </div>
        </transition>

        <div>
          <img :src="currentTrack.image" v-if="!newImage" class="img-fluid" />
          <img :src="track.image" v-if="newImage" class="img-fluid" />
        </div>

        <b-button class="btn btn-primary" @click="addNewImage($event)" value="track">+ Image</b-button>

        <b-button
          class="btn btn-primary ml-2"
          @click="chooseImage($event)"
          value="track"
        >+ Select Image</b-button>

        <b-form-group id="name" label="Name" label-for="name" class="text-left">
          <b-input id="name" v-model="currentTrack.name" type="text"></b-input>
        </b-form-group>

        <b-form-group id="corners" label="Corners" label-for="corners" class="text-left">
          <b-input id="corners" v-model.trim="currentTrack.corners" type="number"></b-input>
        </b-form-group>

        <b-form-group id="length" label="Length (m)" label-for="length" class="text-left">
          <b-input id="length" v-model.trim="currentTrack.length" type="text"></b-input>
        </b-form-group>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editTrackOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editTrackOnCancel">Cancel</b-button>
      </div>
    </b-modal>
    <!-- Edit track  -->
    <!-- Edit round   -->
    <b-modal
      v-model="editDialog"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
    >
      <b-form-select v-model="selectTrack.selected" :options="trackOptions" size="sm" class="mt-3">
        <template v-slot:first>
          <b-form-select-option :value="null" disabled>-- Select the track --</b-form-select-option>
        </template>
      </b-form-select>

      <b-form @submit.prevent>
        <b-form-group id="date" label="Date" label-for="date" class="text-left">
          <span>Current date: {{ currentRound.date | formatDate}}</span>
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
    <!-- Edit round   -->
    <!-- New image modal  -->
    <b-modal
      v-model="newImageUpload"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <h5>Upload a new image</h5>

      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <div v-if="imageUrl">
          <img :src="imageUrl" class="img-fluid" />
        </div>
      </div>

      <input
        type="file"
        @change="checkFile"
        ref="fileInput"
        accept="image/*"
        v-if="input == 'track'"
      />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="close">Close</b-button>
      </div>

      <p class="text-success" v-if="confirmation">Image uploaded !</p>
    </b-modal>
    <!-- New image modal  -->
    <!-- User Prompt  -->
    <b-modal
      v-model="userPrompt"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <h5>Duplicate image</h5>

      <div class="container">
        <img :src="imageUrl" class="img-fluid" />
      </div>

      <p>Duplicate image would you like to use this image ?</p>

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="confirm">Yes</b-button>
        <b-button class="mr-2" @click="decline">No</b-button>
      </div>
    </b-modal>
    <!-- User Prompt  -->
    <!-- Select single image -->
    <b-modal
      v-model="imageChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Circuits">
        <b-form-radio-group id="radio" v-model="select" name="Circuits">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(image, index) in images" :key="index">
                <img class="img-fluid" :src="image.url" />
                <b-form-radio :value="image.id" class="mx-auto"></b-form-radio>
              </div>
            </div>
          </div>
        </b-form-radio-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select single image  -->
    <!-- Models -->
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      round: {
        date: "",
        number: ""
      },
      trackId: null,
      newImageUpload: null,
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
        trackId: null,
        date: "",
        number: ""
      },
      currentTrack: {},
      track: {},
      trackView: null,
      input: null,
      userPrompt: null,
      select: null,
      imageChoice: null,
      newImage: null
    };
  },
  computed: {
    tracks() {
      return this.$store.getters["calender/getAllTracks"];
    },
    calender() {
      return this.$store.getters["calender/getAllRounds"];
    },
    trackOptions() {
      return this.$store.getters["calender/getTrackOptions"];
    },
    request() {
      return this.$store.getters["images/getRequest"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    imageUrl() {
      return this.$store.getters["images/getTrackUrl"];
    },
    images() {
      return this.$store.getters["images/getTrackImages"];
    }
  },
  methods: {
    createRound() {
      fb.calenderRounds
        .add({
          number: this.round.number,
          date: this.round.date,
          trackId: this.trackId,
          trackName: this.trackName,
          createdOn: new Date(),
          image: this.trackImage
        })
        .then(() => {
          this.trackId = null;
          this.round.date = "";
          this.round.number = "";
          this.trackName = null;
          this.trackImage = "";
          this.selectTrack.selected = null;
        })
        .catch(error => alert(error.message));
    },
    selectOption(id) {
      fb.tracksCollection
        .doc(id)
        .get()
        .then(doc => {
          this.trackId = doc.id;
          this.trackName = doc.data().name;
          this.trackImage = doc.data().image;
        })
        .catch(error => alert(error.message));
    },
    editRound(round) {
      this.roundToEdit = round;
      this.currentRound = round;
      this.editDialog = true;
      this.editForm.number = round.number;
      this.selectTrack.selected = round.trackId;
    },
    editOnConfirm() {
      fb.tracksCollection
        .doc(this.selectTrack.selected)
        .get()
        .then(doc => {
          this.trackName = doc.data().name;
          this.trackImage = doc.data().image;
        })
        .then(() => {
          fb.calenderRounds
            .doc(this.roundToEdit.id)
            .update({
              trackId: this.selectTrack.selected,
              date: this.editForm.date,
              number: this.editForm.number,
              createdOn: new Date(),
              trackName: this.trackName,
              image: this.trackImage
            })
            .then(() => {
              this.editForm.date = "";
              this.editForm.number = "";
              this.selectTrack.selected = null;
              this.editDialog = false;
              this.editConf("rounds");
              this.trackName = "";
              this.trackImage = "";
            })
            .catch(err => {
              alert(err.message);
            });
        });
    },
    editOnCancel() {
      this.roundToEdit = null;
      this.editDialog = false;
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
          this.viewTrack.track = doc.data();
          this.viewTrack.track.id = doc.id;
          this.trackView = true;
        })
        .catch(error => alert(error.message));
    },
    editTrack(track) {
      this.trackToEdit = track;
      this.currentTrack = track;
      this.track = this.currentTrack;
      this.editTrackDialog = true;
      this.viewTrack.selected = track.id;
    },
    editTrackOnConfirm() {
      fb.tracksCollection
        .doc(this.trackToEdit.id)
        .update({
          name: this.track.name,
          corners: this.track.corners,
          length: this.track.length,
          createdOn: new Date(),
          image: this.track.image,
          imageId: this.track.imageId
        })
        .then(() => {
          this.currentTrack = {};
          this.editTrackDialog = false;
          this.viewTrack.selected = null;
          this.trackToEdit = null;
          this.trackView = null;
          this.editConf("track");
        })
        .catch(err => {
          alert(err.message);
        });
    },
    editTrackOnCancel() {
      this.trackToEdit = null;
      this.currentTrack = {};
      this.editTrackDialog = false;
      this.trackView = null;
      this.viewTrack.selected = null;
    },
    deleteTrack(track) {
      fb.tracksCollection.doc(track.id).delete();
    },
    editConf(type) {
      this.confirm = type;
      setInterval(() => {
        this.confirm = false;
      }, 3000);
    },
    // adding a new image
    addNewImage(event) {
      if (event.target.value == "track") {
        this.newImageUpload = true;
        this.input = "track";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      fb.tracksImagesCollection
        .where("name", "==", file.name)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              exist = true;
              if (this.input == "track") {
                this.track.image = doc.data().url;
                this.newImage = true;
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setTrackUrl", doc.data().url);
              }
              return;
            }
          });
        })
        .then(() => {
          if (!exist) {
            this.$store.dispatch("images/uploadTrackImage", file);
          }
        });
    },
    // prompt user that image exists
    decline() {
      if (this.input == "track") {
        this.userPrompt = false;
        this.$store.commit("images/setTrackUrl", null);
        this.imageId = null;
        this.$refs.fileInput.value = "";
        this.track.image = null;
        this.input == "";
        this.newImage = false;
      }
    },
    confirm() {
      if (this.input == "track") {
        this.track.image = this.$store.getters["images/getTrackUrl"];
        this.track.imageId = this.imageId;
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.newImageUpload = false;
        this.$store.commit("images/setTrackUrl", null);
        this.newImage = true;
        this.input = "";
      }
    },
    close() {
      if (this.input == "track") {
        let url = this.$store.getters["images/getTrackUrl"];
        this.track.image = url;
        this.newImageUpload = false;
        fb.tracksImagesCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              this.track.imageId = doc.id;
            });
          });
        this.$refs.fileInput.value = "";
        this.$store.commit("images/setTrackUrl", null);
        this.input = "";
      }
    },
    // select image
    chooseImage(event) {
      if (event.target.value == "track") {
        this.imageChoice = true;
        this.select = this.currentTrack.imageId;
      }
    },
    confirmSelection() {
      if (this.imageChoice) {
        fb.tracksImagesCollection
          .doc(this.select)
          .get()
          .then(doc => {
            let image = doc.data();
            this.newImage = true;
            this.track.image = image.url;
            this.track.imageId = doc.id;
          })
          .then(() => {
            this.imageChoice = false;
            this.select = null;
          });
      }
    },
    closeSel() {
      if (this.imageChoice) {
        this.imageChoice = false;
        this.select = null;
      }
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
    this.$store.dispatch("calender/setAllTracks");
    this.$store.dispatch("calender/setAllRounds");
    this.$store.dispatch("images/setTrackImages");
  }
};
</script>
