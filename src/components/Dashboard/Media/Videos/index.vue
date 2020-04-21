<template>
  <div>
    <h1 class="text-left">Videos</h1>
    <hr class="balfe-line" />
    <div v-if="videos.length > 0">
      <div class="row">
        <div class="col-6 col-md-4 col-lg-2" v-for="(video, index) in videos" :key="index">
          <img :src="video.url" class="img-fluid" />
          <p scope="row">{{ video.name }}</p>
          <div class="d-block">
            <p class="d-inline">Uploaded: {{ video.createdOn | formatCreation }}</p>
            <div class="d-inline pl-2 text-primary" @click="deleteVideo(video)">Delete</div>
          </div>
        </div>
      </div>
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
import moment from "moment";
const fb = require("../../../../firebaseConfig");

export default {
  data() {
    return {
      deleteDialog: false,
      editDialog: false,
      toDelete: null
    };
  },
  computed: {
    videos() {
      return this.$store.getters["videos/getAllVideos"];
    }
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
  },
  created() {
    this.$store.dispatch("videos/setAllVideos");
  }
};
</script>
