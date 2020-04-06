<template>
  <div class="text-left">
    <h1 class="text-left">Add posts</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <!-- Image upload section  -->
      <h4>Headline image</h4>

      <b-button class="btn btn-outline-primary" @click="addNewImage">+ New Image</b-button>
      <b-button class="btn btn-outline-primary ml-2" @click="chooseImage">+ Select Image</b-button>

      <!-- Image upload section  -->
      <b-form-group id="title" label="Title" label-for="title" class="text-left">
        <b-input
          id="title"
          v-model.trim="post.title"
          type="text"
          required
          placeholder="Maximun 100 characters"
          v-model="post.title"
          @blur="$v.post.title.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.post.title.$error">This input is required</p>
        <p
          class="error-label"
          v-if="!$v.post.title.maxLength"
        >Maximum of {{ $v.post.title.$params.maxLength.max }} characters</p>
      </b-form-group>

      <b-form-group id="date" label="Date" label-for="date" class="text-left">
        <datepicker id="date" v-model="post.date" @blur="$v.post.date.$touch()" required></datepicker>
        <p class="error-label" v-if="$v.post.date.$error">Date required</p>
      </b-form-group>

      <b-form-group id="excerpt" label="Excerpt" label-for="excerpt" class="text-left">
        <b-input
          id="excerpt"
          v-model.trim="post.excerpt"
          type="text"
          required
          placeholder="Maximun 500 characters"
          v-model="post.excerpt"
          @blur="$v.post.excerpt.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.post.excerpt.$error">This input is required</p>
        <p
          class="error-label"
          v-if="!$v.post.excerpt.maxLength"
        >Maximum of {{ $v.post.excerpt.$params.maxLength.max }} characters</p>
      </b-form-group>

      <b-form-group id="content" label="Content" label-for="content" class="text-left">
        <wysiwyg id="content" v-model="post.main"></wysiwyg>
      </b-form-group>

      <b-form-group id="comments" label="Comments" label-for="comments" class="text-left">
        <wysiwyg id="comments" v-model="post.comments"></wysiwyg>
      </b-form-group>
      <!-- select image  -->
      <h4>Gallery images</h4>
      <div v-if="selectImage.selected">
        <img :src="selectImage.selectedUrl" class="mt-3 img-fluid" />
      </div>
      <div class="input_field">
        <input type="file" @change="uploadImage" ref="fileInput" accept="image/*" />
      </div>
      <b-form-select
        v-model="selectImage.selected"
        :options="options"
        size="sm"
        class="mt-3"
        @change="selectOption"
      >
        <template v-slot:first>
          <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
        </template>
      </b-form-select>
      <!-- gallery view  -->
      <div class="row" v-for="(images, index) in galleryImages" :key="index">
        <div class="col-sm-6 col-md-4 col-lg-4">
          <img :src="images.url" class="img-fluid" />
        </div>
      </div>
      <b-button type="submit" :disabled="post.title == ''" variant="primary">Add post</b-button>
    </b-form>

    <!-- New image modal  -->
    <b-modal v-model="newImage" hide-header hide-footer centered>
      <h5>Upload a new image</h5>

      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <img :src="imageUrl" class="img-fluid" />
      </div>

      <input type="file" @change="uploadFile" ref="fileInput" accept="image/*" />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="cancel">Close</b-button>
      </div>

      <p class="text-success" v-if="uploadSucsess">Image uploaded !</p>
    </b-modal>
    <!-- New image modal  -->

    <b-modal v-model="dialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>Your post has no content are you sure you want to post this ?</p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="dialogOnCancel">Close</b-button>
        <b-button variant="primary" @click="dialogOnConfirm">Add post</b-button>
      </div>
    </b-modal>

    <div v-if="postAdded" variant="success">Your post has been added!</div>
    <div v-if="errorMsg !== ''" class="error-msg">
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions } from "vuex";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      post: {
        image: "",
        title: "",
        main: "",
        comments: "",
        excerpt: "",
        date: "",
        gallery: ""
      },
      galleryImages: [],
      fullPost: {},
      postAdded: null,
      // image options
      selectImage: {
        selected: null,
        selectedUrl: null
      },
      // Headline image
      newImage: false,
      uploadSucsess: false,
      imageChoice: false,
      // Gallery
      dialog: false,
      errorMsg: "",
      performingRequest: false,
      imageId: null,
      exist: false
    };
  },
  validations: {
    post: {
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
  computed: {
    ...mapState(["imageUrl", "options", "request"]),
    ...mapActions(["imageUpload"])
  },
  methods: {
    // creating a post
    createPost() {
      fb.postsCollection
        .add({
          createdOn: new Date(),
          imageId: this.imageId,
          image: this.post.image,
          main: this.post.main,
          title: this.post.title,
          comments: this.post.comments,
          excerpt: this.post.excerpt,
          date: this.post.date,
          gallery: this.galleryImages
        })
        .then(() => {
          this.postAdded = true;
          this.$v.$reset();
          this.$refs.fileInput.value = "";
          this.post.main = "";
          this.post.comments = "";
          this.post.image = "";
          this.post.title = "";
          this.post.excerpt = "";
          this.post.date = "";
          this.performingRequest = false;
          this.exist = false;
          setInterval(() => {
            this.postAdded = null;
          }, 3000);
        })
        .catch(err => {
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    // adding a new image
    addNewImage() {
      this.newImage = true;
    },
    uploadFile(event) {
      let file = event.target.files[0];
      this.$store.dispatch("imageUpload", file);
    },
    cancel() {
      this.newImage = false;
    },
    chooseImage() {
      this.imageChoice = true;
    },
    submitHandler() {
      if (!this.$v.$invalid) {
        if (this.post.main === "") {
          this.dialog = true;
        } else {
          this.createPost();
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
      this.createPost();
    },
    uploadImage(event) {
      this.performingRequest = true;
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("images/" + file.name);
      let uploadTask = storageRef.put(file);
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
            this.selectImage.selectedUrl = downloadURL;
            let galleryImage = {
              name: file.name,
              url: downloadURL
            };
            this.galleryImages.push(galleryImage);
            fb.imageUrlCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(err => {
                this.performingRequest = false;
                this.errorMsg = err.message;
              });
          });
        }
      );
    },
    selectOption(id) {
      if (id) {
        fb.imageUrlCollection
          .doc(id)
          .get()
          .then(doc => {
            let image = doc.data();
            let galleryImage = {
              name: image.name,
              url: image.url
            };
            this.galleryImages.push(galleryImage);
            this.selectImage.selectedUrl = image.url;
          })
          .catch(error => alert(error.message));
      }
    }
  }
};
</script>

<style lang="css" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
