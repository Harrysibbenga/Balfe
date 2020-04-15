<template>
  <div class="text-left">
    <h1 class="text-left">Add partner</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <img :src="partner.logo" class="img-fluid" />
      </div>

      <b-button class="btn btn-outline-primary" @click="addNewImage($event)" value="partner">+ Image</b-button>

      <b-form-group id="name" label="Name" label-for="name" class="text-left">
        <b-input
          id="name"
          v-model.trim="partner.name"
          type="text"
          required
          placeholder="Partner name"
        ></b-input>
      </b-form-group>

      <b-form-group id="desc" label="Description" label-for="desc" class="text-left">
        <wysiwyg id="desc" v-model="partner.desc"></wysiwyg>
      </b-form-group>

      <b-button type="submit" :disabled="partner.desc == ''" variant="primary">Add partner</b-button>
    </b-form>

    <div v-if="partnerAdded" class="text-success">Your partner has been added!</div>

    <!-- Modals -->
    <!-- New image modal  -->
    <b-modal
      v-model="newImage"
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
    <!-- Modals -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      partner: {
        name: "",
        desc: "",
        logo: ""
      },
      logoId: null,
      partnerAdded: null,
      userPrompt: null,
      newImage: null,
      input: null
    };
  },
  validations: {
    partner: {
      name: {
        required
      }
    }
  },
  methods: {
    // adding a new image
    addNewImage(event) {
      this.newImage = true;
      if (event.target.value == "partner") {
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
              if (this.$refs.fileInput) {
                this.partner.logo = doc.data().url;
                this.logoId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setLogoUrl", doc.data().url);
                this.type = "partner";
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
      if (this.type == "partner") {
        this.userPrompt = false;
        this.$store.commit("images/setLogoUrl", null);
        this.logoId = null;
        this.$refs.fileInput.value = "";
        this.partner.logo = null;
        this.type == "";
      }
    },
    confirm() {
      if (this.type == "partner") {
        this.partner.logo = this.$store.getters["images/getLogoUrl"];
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.type = "";
        this.newImage = false;
        this.$store.commit("images/setLogoUrl", null);
      }
    },
    close() {
      if (this.input == "partner") {
        let url = this.$store.getters["images/getLogoUrl"];
        this.partner.logo = url;
        this.newImage = false;
        fb.logosCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              this.logoId = doc.id;
            });
          });
        this.$refs.fileInput.value = "";
        this.$store.commit("images/setLogoUrl", null);
        this.type = "";
      }
    },
    submitHandler() {
      this.$store.commit("images/setRequest", true);
      fb.partnersCollection
        .add({
          name: this.partner.name,
          desc: this.partner.desc,
          logoUrl: this.partner.logo,
          logoId: this.logoId,
          createdOn: new Date()
        })
        .then(() => {
          this.partner.name = "";
          this.partner.desc = "";
          this.partner.logo = "";
          this.logoId = "";
          this.$v.$reset();
          this.partnerAdded = true;
          this.$store.commit("images/setRequest", false);
          this.$store.commit("images/setLogoUrl", null);
          setTimeout(() => {
            this.partnerAdded = false;
          }, 3000);
        });
    }
  },
  computed: {
    request() {
      return this.$store.getters["images/getRequest"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    logoUrl() {
      return this.$store.getters["images/getLogoUrl"];
    }
  }
};
</script>
