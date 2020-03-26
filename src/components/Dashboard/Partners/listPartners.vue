<template>
  <div>
    <h1 class="text-left">Manage partners</h1>
    <hr class="balfe-line" />
    <div v-if="partners.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Logo</th>
            <th scope="col">Description</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(partner, index) in partners" :key="index">
            <th scope="row">{{ partner.name }}</th>
            <td>
              <img :src="partner.logo" class="img-fluid" />
            </td>
            <td>{{ partner.desc }}</td>
            <td>{{ partner.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-dark" @click="editPartner(partner)">Edit</div>
              <div class="d-inline px-1 text-primary" @click="deletePartner(partner)">Delete</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no partners yet .......... Add some!</div>
    <b-modal v-model="deleteDialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>
          Are you sure you want to delete this partner ? ( there's no turning
          back )
        </p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="deleteOnConfirm">Yes, delete</b-button>
        <b-button variant="primary" @click="deleteOnCancel">No, do not delete it</b-button>
      </div>
    </b-modal>

    <b-modal v-model="editDialog" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <div v-if="selectImage.selected">
          <img :src="selectImage.selectedUrl" class="mt-3 img-fluid" />
        </div>
        <div v-else>
          <img :src="currentPartner.logo" v-if="!newImage" class="img-fluid" />
          <img :src="partner.logo" v-if="newImage" class="img-fluid" />
        </div>
        <div class="input_field">
          <input type="file" @change="uploadImage" ref="fileInput" accept="image/*" />
        </div>
        <b-form-select
          v-model="selectImage.selected"
          :options="partnerOptions"
          size="sm"
          class="mt-3"
          @change="selectOption"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
          </template>
        </b-form-select>
        <b-form-group id="name" label="name" label-for="name" class="text-left">
          <b-input
            id="name"
            v-model.trim="partner.name"
            type="text"
            :placeholder="currentPartner.name"
          ></b-input>
        </b-form-group>

        <b-form-group
          id="description"
          label="Description"
          label-for="description"
          class="text-left"
        >
          <wysiwyg id="description" v-model="partner.desc">
            {{
            currentPartner.desc
            }}
          </wysiwyg>
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
      partner: {
        name: "",
        desc: "",
        logo: ""
      },
      performingRequest: false,
      newImage: false,
      deleteDialog: false,
      editDialog: false,
      currentPartner: {},
      toDelete: null,
      toEdit: null,
      selectImage: {
        selected: null,
        selectedUrl: null
      }
    };
  },
  computed: {
    ...mapState(["partners", "partnerOptions"])
  },
  methods: {
    deletePartner(partner) {
      this.toDelete = partner;
      this.deleteDialog = true;
    },
    deleteOnCancel() {
      this.deleteDialog = false;
    },
    deleteOnConfirm() {
      this.deleteDialog = false;
      fb.partnersCollection.doc(this.toDelete.id).delete();
    },
    editPartner(partner) {
      this.toEdit = partner;
      this.currentPartner = partner;
      this.editDialog = true;
      this.partner.logo = this.currentPartner.logo;
      this.partner.name = this.currentPartner.name;
      this.partner.desc = this.currentPartner.desc;
    },
    editOnCancel() {
      this.editDialog = false;
      this.currentPartner = {};
    },
    editOnConfirm() {
      this.editDialog = false;

      let logo = this.partner.logo,
        name = this.partner.name,
        desc = this.partner.desc;

      fb.partnersCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          logo: logo,
          name: name,
          desc: desc
        })
        .then(() => {
          this.currentPartner = {};
          this.newImage = false;
        })
        .catch(error => alert(error.message));
    },
    uploadImage(event) {
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("logos/" + file.name);
      let uploadTask = storageRef.put(file);
      this.newImage = true;
      this.selectImage.selected = false;
      this.performingRequest = true;
      uploadTask.on(
        "state_changed",
        () => {
          // snapshot
        },
        () => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.partner.logo = downloadURL;
            fb.logosCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(error => alert(error.message));
          });
        }
      );
    },
    selectOption(id) {
      if (id) {
        fb.logosCollection
          .doc(id)
          .get()
          .then(doc => {
            let image = doc.data();
            this.selectImage.selectedUrl = image.url;
            this.partner.logo = image.url;
          })
          .catch(error => alert(error.message));
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
  }
};
</script>

<style lang="scss" >
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(black, 0.4);
  z-index: 9999;

  p {
    background: white;
    width: 150px;
    text-align: center;
    margin: 40vh auto 0;
    padding: 40px 0;
    border-radius: 3px;
    box-shadow: 0 0 20px 0 rgba(black, 0.5);
  }
}
// transitions
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
