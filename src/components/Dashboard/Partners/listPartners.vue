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
              <img :src="partner.logoUrl" class="img-fluid" width="200px" />
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
    <!-- Models -->
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
        <div v-if="logoUrl">
          <img :src="logoUrl" class="img-fluid" />
        </div>
      </div>

      <input
        type="file"
        @change="checkFile"
        ref="fileInput"
        accept="image/*"
        v-if="input == 'partner'"
      />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="close">Close</b-button>
      </div>

      <p class="text-success" v-if="confirmation">Image uploaded !</p>
    </b-modal>
    <!-- New image modal  -->
    <!-- Delete  -->
    <b-modal
      v-model="deleteDialog"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="lg"
    >
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
    <!-- Delete  -->
    <!-- Edit -->
    <b-modal
      v-model="editDialog"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <div>
          <img :src="currentPartner.logoUrl" v-if="!newImage" class="img-fluid" />
          <img :src="partner.logoUrl" v-if="newImage" class="img-fluid" />
        </div>

        <b-button
          class="btn btn-outline-primary"
          @click="addNewImage($event)"
          value="partner"
        >+ Image</b-button>

        <b-button
          class="btn btn-outline-primary ml-2"
          @click="chooseImage($event)"
          value="partner"
        >+ Select Image</b-button>

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
    <!-- Edit -->
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
        <img :src="logoUrl" class="img-fluid" />
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
      v-model="logoChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Logos">
        <b-form-radio-group id="radio" v-model="select" name="Logos">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(logo, index) in logos" :key="index">
                <img class="img-fluid" :src="logo.url" />
                <b-form-radio :value="logo.id" class="mx-auto"></b-form-radio>
              </div>
            </div>
          </div>
        </b-form-radio-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select single image  -->
    <!-- Models  -->
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      partner: {
        name: "",
        desc: "",
        logoUrl: "",
        logoId: ""
      },
      newImage: false,
      newImageUpload: false,
      input: null,
      select: null,
      userPrompt: null,
      logoChoice: null,
      deleteDialog: false,
      editDialog: false,
      currentPartner: {},
      toDelete: null,
      toEdit: null
    };
  },
  computed: {
    partners() {
      return this.$store.getters["partners/getPartners"];
    },
    request() {
      return this.$store.getters["images/getRequest"];
    },
    logoUrl() {
      return this.$store.getters["images/getLogoUrl"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    logos() {
      return this.$store.getters["images/getLogos"];
    }
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
      this.partner.logoId = this.currentPartner.logoId;
    },
    editOnCancel() {
      this.editDialog = false;
      this.currentPartner = {};
    },
    editOnConfirm() {
      this.editDialog = false;

      let logoUrl = this.partner.logoUrl,
        name = this.partner.name,
        desc = this.partner.desc,
        logoId = this.partner.logoId;

      fb.partnersCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          logoUrl: logoUrl,
          name: name,
          desc: desc,
          logoId: logoId
        })
        .then(() => {
          this.currentPartner = {};
          this.newImage = false;
          this.partner.logoId = "";
          this.partner.logoUrl = "";
          this.partner.name = "";
          this.partner.desc = "";
          this.logoId = "";
        })
        .catch(error => alert(error.message));
    },
    // adding a new image
    addNewImage(event) {
      if (event.target.value == "partner") {
        this.newImageUpload = true;
        this.input = "partner";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      fb.logosCollection
        .where("name", "==", file.name)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              exist = true;
              if (this.input == "partner") {
                this.partner.logoUrl = doc.data().url;
                this.newImage = true;
                this.logoId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setLogoUrl", doc.data().url);
              }
              return;
            }
          });
        })
        .then(() => {
          if (!exist) {
            this.$store.dispatch("images/uploadLogo", file);
          }
        });
    },
    // prompt user that image exists
    decline() {
      if (this.input == "partner") {
        this.userPrompt = false;
        this.$store.commit("images/setImageUrl", null);
        this.logoId = null;
        this.$refs.fileInput.value = "";
        this.partner.logoUrl = null;
        this.input == "";
        this.newImage = false;
      }
    },
    confirm() {
      if (this.input == "partner") {
        this.partner.logoUrl = this.$store.getters["images/getLogoUrl"];
        this.partner.logoId = this.logoId;
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.newImageUpload = false;
        this.$store.commit("images/setLogoUrl", null);
        this.newImage = true;
        this.input = "";
      }
    },
    close() {
      if (this.input == "partner") {
        let url = this.$store.getters["images/getLogoUrl"];
        this.partner.logoUrl = url;
        this.newImageUpload = false;
        fb.logosCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              this.partner.logoId = doc.id;
            });
          });
        this.$refs.fileInput.value = "";
        this.$store.commit("images/setLogoUrl", null);
        this.input = "";
      }
    },
    // select image
    chooseImage(event) {
      if (event.target.value == "partner") {
        this.logoChoice = true;
        this.select = this.currentPartner.logoId;
      }
    },
    confirmSelection() {
      if (this.logoChoice) {
        fb.logosCollection
          .doc(this.select)
          .get()
          .then(doc => {
            let image = doc.data();
            this.newImage = true;
            this.partner.logoUrl = image.url;
            this.partner.logoId = doc.id;
          })
          .then(() => {
            this.logoChoice = false;
            this.select = null;
          });
      }
    },
    closeSel() {
      if (this.logoChoice) {
        this.logoChoice = false;
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
    this.$store.dispatch("partners/setPartners");
    this.$store.dispatch("images/setLogos");
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
