<template>
  <div>
    <h1 class="text-left">Logos</h1>
    <hr class="balfe-line" />
    <div v-if="logos.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Logo</th>
            <th scope="col">Uploaded</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(logo, index) in logos" :key="index">
            <th scope="row">{{ logo.name }}</th>
            <td>
              <img :src="logo.url" class="img-fluid" />
            </td>
            <td>{{ logo.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-primary" @click="deleteLogo(logo)">
                Delete
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
        <b-button variant="primary" @click="deleteOnCancel"
          >No, do not delete it</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
    ...mapState(["logos"])
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
      this.deleteDialog = false;
      fb.logosCollection.doc(this.toDelete.id).delete();
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
