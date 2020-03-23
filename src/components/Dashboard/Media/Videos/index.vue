<template>
  <div>
    <h1 class="text-left">Videos</h1>
    <hr class="balfe-line" />
    <div v-if="videos.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Video</th>
            <th scope="col">Uploaded</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(video, index) in videos" :key="index">
            <th scope="row">{{ video.name }}</th>
            <td>
              <img :src="video.url" class="img-fluid" />
            </td>
            <td>{{ video.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-primary" @click="deleteVideo(video)">Delete</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no videos yet .......... Add some!</div>
    <b-modal v-model="deleteDialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>Are you sure you want to delete this video ?</p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="deleteOnConfirm">Yes, delete</b-button>
        <b-button variant="primary" @click="deleteOnCancel">No, do not delete it</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../../../../../balfeconfig/firebaseConfig.js");

export default {
  data() {
    return {
      deleteDialog: false,
      editDialog: false,
      toDelete: null
    };
  },
  computed: {
    ...mapState(["videos"])
  },
  methods: {
    deleteVideo(video) {
      this.toDelete = video;
      this.deleteDialog = true;
    },
    deleteOnCancel() {
      this.deleteDialog = false;
    },
    deleteOnConfirm() {
      this.deleteDialog = false;
      fb.videosCollection.doc(this.toDelete.id).delete();
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