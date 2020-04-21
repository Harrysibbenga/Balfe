<template>
  <div>
    <h1 class="text-left">Logos</h1>
    <hr class="balfe-line" />
    <div v-if="logos.length > 0">
      <div class="row">
        <div class="col-6 col-md-4 col-lg-2" v-for="(logo, index) in logos" :key="index">
          <img :src="logo.url" class="img-fluid" />
          <p scope="row">{{ logo.name }}</p>
          <div class="d-block">
            <p class="d-inline">Uploaded: {{ logo.createdOn | formatCreation }}</p>
            <div class="d-inline pl-2 text-primary" @click="deleteLogo(logo)">Delete</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Sorry no logos yet .......... Add some!</div>
    <b-modal v-model="deleteDialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>
          Are you sure you want to delete this logo ? ( be sure to change the
          partners with this logo )
        </p>
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
    logos() {
      return this.$store.getters["images/getLogos"];
    }
  },
  methods: {
    deleteLogo(logo) {
      this.toDelete = logo;
      this.deleteDialog = true;
    },
    deleteOnCancel() {
      this.deleteDialog = false;
    },
    deleteOnConfirm() {
      fb.logosCollection.doc(this.toDelete.id).delete();
      this.deleteDialog = false;
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
    this.$store.dispatch("images/setLogos");
  }
};
</script>
