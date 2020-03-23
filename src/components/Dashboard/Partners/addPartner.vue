<template>
  <div class="container text-left">
    <h1 class="text-left">Add partner</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <img :src="partner.logo" class="img-fluid" />
      <div class="input_field">
        <input
          type="file"
          @change="uploadImage"
          ref="fileInput"
          accept="image/*"
        />
      </div>

      <b-form-group id="name" label="Name" label-for="name" class="text-left">
        <b-input
          id="name"
          v-model.trim="partner.name"
          type="text"
          required
          placeholder="Partner name"
          v-model="partner.name"
        ></b-input>
      </b-form-group>

      <b-form-group
        id="desc"
        label="Description"
        label-for="desc"
        class="text-left"
      >
        <wysiwyg id="desc" v-model="partner.desc"></wysiwyg>
      </b-form-group>

      <b-button type="submit" :disabled="partner.desc == ''" variant="primary"
        >Add post</b-button
      >
    </b-form>

    <div v-if="partnerAdded" variant="success">
      Your partner has been added!
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
const fb = require("../../../../balfeconfig/firebaseConfig.js");

export default {
  data() {
    return {
      partner: {
        name: "",
        desc: "",
        logo: ""
      },
      performingRequest: false,
      partnerAdded: null
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
    uploadImage(event) {
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("logos/" + file.name);
      let uploadTask = storageRef.put(file);
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
            console.log("File available at", downloadURL);
            fb.logosCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(err => {
                console.log(err);
              });
          });
        }
      );
    },
    submitHandler() {
      fb.partnersCollection
        .add({
          name: this.partner.name,
          desc: this.partner.desc,
          logo: this.partner.logo,
          createdOn: new Date()
        })
        .then(() => {
          this.partnerAdded = true;
        })
        .then(() => {
          (this.$refs.fileInput.value = ""),
            (this.partner.name = ""),
            (this.partner.desc = ""),
            (this.partner.logo = "");
          setTimeout(() => {
            this.partnerAdded = null;
          }, 3000);
        });
    }
  }
};
</script>
