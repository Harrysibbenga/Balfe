<template>
  <div class="text-left">
    <h1 class="text-left">Add historys</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <!-- Image upload section  -->
      <h4>Headline image</h4>

      <b-button class="btn btn-primary" @click="addNewImage($event)" value="history">+ Image</b-button>

      <!--/Image upload section  -->
      <div class="container">
        <img :src="history.image" class="img-fluid" />
      </div>

      <b-form-group id="title" label="Title" label-for="title" class="text-left">
        <b-input
          id="title"
          v-model.trim="history.title"
          type="text"
          required
          placeholder="Maximun 100 characters"
          @blur="$v.history.title.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.history.title.$error">This input is required</p>
        <p
          class="error-label"
          v-if="!$v.history.title.maxLength"
        >Maximum of {{ $v.history.title.$params.maxLength.max }} characters</p>
      </b-form-group>

      <b-form-group id="date" label="Date" label-for="date" class="text-left">
        <datepicker id="date" v-model="history.date" @blur="$v.history.date.$touch()" required></datepicker>
        <p class="error-label" v-if="$v.history.date.$error">Date required</p>
      </b-form-group>

      <b-form-group id="excerpt" label="Excerpt" label-for="excerpt" class="text-left">
        <b-input
          id="excerpt"
          v-model.trim="history.excerpt"
          type="text"
          required
          placeholder="Maximun 500 characters"
          @blur="$v.history.excerpt.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.history.excerpt.$error">This input is required</p>
        <p
          class="error-label"
          v-if="!$v.history.excerpt.maxLength"
        >Maximum of {{ $v.history.excerpt.$params.maxLength.max }} characters</p>
      </b-form-group>

      <b-form-group id="content" label="Content" label-for="content" class="text-left">
        <wysiwyg id="content" v-model="history.main"></wysiwyg>
      </b-form-group>

      <b-form-group id="comments" label="Comments" label-for="comments" class="text-left">
        <wysiwyg id="comments" v-model="history.comments"></wysiwyg>
      </b-form-group>

      <!-- gallery images  -->
      <h4>Gallery images</h4>

      <div class="form-group">
        <b-button class="btn btn-primary" @click="addNewImage($event)" value="gallery">+ Image</b-button>

        <b-button class="btn btn-primary ml-2" @click="chooseImage">+ Select Images</b-button>
      </div>

      <p class="text-success" v-if="confirmation">Image uploaded !</p>

      <!-- gallery view  -->
      <div class="row">
        <div
          class="col-sm-6 col-md-4 col-lg-4"
          v-for="(image, index) in galleryImages"
          :key="index"
        >
          <img :src="image.url" class="img-fluid" />
        </div>
      </div>
      <!-- gallery view  -->

      <!-- gallery images  -->
      <b-button type="submit" :disabled="history.title == ''" variant="primary">Add history</b-button>
    </b-form>
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
        <div v-if="imageUrl">
          <img :src="imageUrl" class="img-fluid" />
        </div>
      </div>

      <input
        type="file"
        @change="checkFile"
        ref="fileInput"
        accept="image/*"
        v-if="input == 'history'"
      />

      <input
        type="file"
        @change="checkFile"
        ref="galleryInput"
        accept="image/*"
        v-if="input == 'gallery'"
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

    <!-- Select images -->
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
      <b-form-group label="Images">
        <b-form-checkbox-group id="checkbox" v-model="selected" name="Images">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(image, index) in images" :key="index">
                <img class="img-fluid" :src="image.url" />
                <b-form-checkbox :value="image.id" class="mx-auto"></b-form-checkbox>
              </div>
            </div>
          </div>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select images  -->

    <!-- history dialog  -->
    <b-modal
      v-model="dialog"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <div class="d-block text-center">
        <p>Your history has no content are you sure you want to history this ?</p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="dialogOnCancel">Close</b-button>
        <b-button variant="primary" @click="dialogOnConfirm">Add history</b-button>
      </div>
    </b-modal>
    <!-- history dialog  -->
    <div v-if="historyAdded" variant="success">Your history has been added!</div>
    <div v-if="errorMsg !== ''" class="error-msg">
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      history: {
        image: "",
        title: "",
        main: "",
        comments: "",
        excerpt: "",
        date: "",
        gallery: ""
      },
      galleryImages: [],
      fullHistoricPost: {},
      historyAdded: null,
      // image options
      selected: [],
      type: "",
      // Headline image
      newImage: false,
      uploadSucsess: false,
      imageChoice: false,
      userPrompt: false,
      // Gallery
      dialog: false,
      errorMsg: "",
      performingRequest: false,
      imageId: null,
      exist: false,
      input: null
    };
  },
  validations: {
    history: {
      title: {
        required,
        maxLength: maxLength(100)
      },
      excerpt: {
        required,
        maxLength: maxLength(500)
      },
      date: {
        required
      }
    }
  },
  methods: {
    // creating a history
    createhistory() {
      fb.historicCollection
        .add({
          createdOn: new Date(),
          imageId: this.imageId,
          image: this.history.image,
          main: this.history.main,
          title: this.history.title,
          comments: this.history.comments,
          excerpt: this.history.excerpt,
          date: this.history.date,
          gallery: this.galleryImages
        })
        .then(() => {
          this.historyAdded = true;
          this.$v.$reset();
          this.history.main = "";
          this.history.comments = "";
          this.history.image = "";
          this.history.title = "";
          this.history.excerpt = "";
          this.history.date = "";
          this.exist = false;
          this.galleryImages = [];
          this.imageId = null;
          this.$store.commit("images/setImageUrl", null);
          setInterval(() => {
            this.historyAdded = null;
          }, 3000);
        })
        .catch(err => {
          this.errorMsg = err.message;
        });
    },
    // adding a new image
    addNewImage(event) {
      this.newImage = true;
      if (event.target.value == "history") {
        this.input = "history";
      } else if (event.target.value == "gallery") {
        this.input = "gallery";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      fb.imageUrlCollection
        .where("name", "==", file.name)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              exist = true;
              if (this.$refs.fileInput) {
                this.history.image = doc.data().url;
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setImageUrl", doc.data().url);
                this.type = "history";
              } else if (this.$refs.galleryInput) {
                this.$store.commit("images/setImageUrl", doc.data().url);
                this.imageId = doc.id;
                this.userPrompt = true;
                this.type = "gallery";
              }
              return;
            }
          });
        })
        .then(() => {
          if (!exist) {
            this.$store.dispatch("images/uploadImage", file);
          }
        });
    },
    // prompt user that image exists
    decline() {
      if (this.type == "history") {
        this.userPrompt = false;
        this.$store.commit("images/setImageUrl", null);
        this.imageId = null;
        this.$refs.fileInput.value = "";
        this.history.image = null;
      } else if (this.type == "gallery") {
        this.userPrompt = false;
        this.imageId = null;
        this.$refs.galleryInput.value = "";
      }
    },
    confirm() {
      if (this.type == "gallery") {
        fb.imageUrlCollection
          .doc(this.imageId)
          .get()
          .then(doc => {
            let image = doc.data();
            let galleryImage = {
              name: image.name,
              url: image.url,
              id: doc.id
            };
            this.galleryImages.push(galleryImage);
          })
          .then(() => {
            this.userPrompt = false;
            this.imageId = null;
            this.$refs.galleryInput.value = "";
            this.type = "";
            this.$store.commit("images/setImageUrl", null);
            this.newImage = false;
          });
      } else if (this.type == "history") {
        this.history.image = this.$store.getters["images/getImageUrl"];
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.type = "";
        this.newImage = false;
        this.$store.commit("images/setImageUrl", null);
      }
    },
    close() {
      if (this.input == "history") {
        this.newImage = false;
        this.$refs.fileInput.value = "";
        let url = this.$store.getters["images/getImageUrl"];
        this.history.image = url;
        this.$store.commit("images/setImageUrl", null);
        this.type = "";
        fb.imageUrlCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              this.imageId = doc.id;
            });
          });
      } else if (this.input == "gallery") {
        this.$store.dispatch(
          "images/getImage",
          this.$store.getters["images/getImageUrl"]
        );
        let image = this.$store.getters["images/getImage"];
        if (image) {
          let galleryImage = {
            name: image.name,
            url: image.url,
            id: this.imageId
          };
          this.galleryImages.push(galleryImage);
        }
        this.newImage = false;
        this.$refs.galleryInput.value = "";
        this.$store.commit("images/setImageUrl", null);
        this.type = "";
      }
    },
    // select image
    chooseImage() {
      this.imageChoice = true;
    },
    confirmSelection() {
      for (let i = 0; i < this.selected.length; i++) {
        let selId = this.selected[i];
        fb.imageUrlCollection
          .doc(selId)
          .get()
          .then(doc => {
            let image = doc.data();
            let galleryImage = {
              name: image.name,
              url: image.url,
              id: doc.id
            };
            this.galleryImages.push(galleryImage);
          })
          .then(() => {
            this.imageChoice = false;
          });
      }
    },
    closeSel() {
      this.imageChoice = false;
    },
    submitHandler() {
      if (!this.$v.$invalid) {
        if (this.history.main === "") {
          this.dialog = true;
        } else {
          this.createhistory();
        }
      } else {
        alert("Something is wrong");
      }
    },
    dialogOnCancel() {
      this.dialog = false;
    },
    dialogOnConfirm() {
      this.dialog = false;
      this.createhistory();
    }
  },
  computed: {
    request() {
      return this.$store.getters["images/getRequest"];
    },
    imageUrl() {
      return this.$store.getters["images/getImageUrl"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    images() {
      return this.$store.getters["images/getImages"];
    }
  },
  created() {
    this.$store.dispatch("images/getImages");
  }
};
</script>

<style lang="css" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.custom-control-inline {
  display: table !important;
}
</style>
